import { QueryTypes } from "sequelize";
import sequelize from "../config/database.js";
import Hospital from "../models/hospital.js";
import AppError from "../utils/app-error.js";
import catchAsync from "../utils/catch-async.js";
import { formatData } from "./ambulance.controller.js";
import redisClient from "../config/redis.js";

// const allHospitals = [
//   {
//     name: "Unilag Medical Centre",
//     lat: 6.51454,
//     lng: 3.39655,
//   },
//   {
//     name: "Lagos University Teaching Hospital (LUTH)",
//     lat: 6.52581,
//     lng: 3.396,
//   },
//   {
//     name: "University of Lagos Medical Centre",
//     lat: 6.5145,
//     lng: 3.3965,
//   },
//   {
//     name: "Gold Cross Hospital (near UNILAG)",
//     lat: 6.516,
//     lng: 3.397,
//   },
//   {
//     name: "Cottage Medicare Hospital",
//     lat: 6.514,
//     lng: 3.395,
//   },
//   {
//     name: "Light Hospital & Maternity Home",
//     lat: 6.5125,
//     lng: 3.398,
//   },
// ];

export const createHospital = catchAsync(async (req, res, next) => {
  const name = req.body?.name;
  const lat = req.body?.lat;
  const long = req.body?.long;

  if (!name) return next(new AppError("Hospital name is required", 400));
  if (!lat || !long)
    return next(new AppError("Hospital coordinates are required", 400));

  // const allLocations = allHospitals.map((el) => {
  //   return {
  //     name: el.name,
  //     location: {
  //       type: "Point",
  //       coordinates: [Number(el.lat), Number(el.lng)],
  //     },
  //   };
  // });

  // await Hospital.bulkCreate(allLocations);

  await Hospital.create({
    name: name.toLowerCase(),
    createdAt: new Date(),
    location: {
      type: "Point",
      coordinates: [Number(lat), Number(long)],
    },
  });

  const hospitals = await Hospital.findAll({
    order: [["createdAt", "DESC"]],
  });

  return res.status(201).json({
    status: "success",
    data: formatData(hospitals),
  });
});

export const listHospitals = catchAsync(async (req, res, next) => {
  const hospitals = await Hospital.findAll({
    order: [["createdAt", "DESC"]],
  });

  const formattedHospitals = formatData(hospitals);

  return res.status(200).json({
    status: "success",
    data: formattedHospitals,
  });
});

export const findNearestAmbulance = catchAsync(async (req, res, next) => {
  const hospitalId = req.params.id;
  if (!hospitalId) return next(new AppError("Hospital ID is required", 400));

  const hospital = await Hospital.findOne({ where: { id: hospitalId } });

  if (!hospital) return next(new AppError("Hospital not found", 404));

  const cacheKey = `nearestAmbulance:${hospitalId}`;

  const cached = await redisClient.get(cacheKey);

  if (cached) {
    return res.status(200).json({
      status: "success",
      data: JSON.parse(cached),
      cached: true,
    });
  }

  const [nearest] = await sequelize.query(
    `
    SELECT
      a.id,
      a.name,
      ST_Y(a.location::geometry) AS lng,
      ST_X(a.location::geometry) AS lat,
      ST_Distance(a.location, h.location) AS distance
    FROM ambulances a
    JOIN hospitals h ON h.id = :hospitalId
    ORDER BY a.location <-> h.location
    LIMIT 1;
  `,
    {
      replacements: { hospitalId },
      type: QueryTypes.SELECT,
    }
  );

  const responseData = {
    hospitalId,
    ambulance: {
      id: nearest.id,
      name: nearest.name,
      lat: nearest.lat,
      lng: nearest.lng,
      distanceInMeters: Math.round(nearest.distance),
    },
  };

  await redisClient.setEx(cacheKey, 30, JSON.stringify(responseData));

  return res.status(200).json({
    status: "success",
    data: responseData,
    cached: false,
  });
});
