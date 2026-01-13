import Ambulance from "../models/ambulance.js";
import AppError from "../utils/app-error.js";
import catchAsync from "../utils/catch-async.js";

export function formatData(list) {
  return list.map((el) => {
    const location = el.location;

    return {
      id: el.id,
      name: el.name,
      lat: location?.coordinates[0],
      lng: location?.coordinates[1],
      createdAt: el.createdAt,
      updatedAt: el.updatedAt,
    };
  });
}

export const createAmbulance = catchAsync(async (req, res, next) => {
  const name = req.body?.name;
  const lat = req.body?.lat;
  const long = req.body?.long;

  if (!name) return next(new AppError("Ambulance name is required", 400));
  if (!lat || !long)
    return next(new AppError("Ambulance coordinates are required", 400));

  await Ambulance.create({
    name: name.toLowerCase(),
    createdAt: new Date(),
    location: {
      type: "Point",
      coordinates: [Number(lat), Number(long)],
    },
  });

  const ambulance = await Ambulance.findAll({
    order: [["createdAt", "DESC"]],
  });

  return res.status(201).json({
    status: "success",
    data: formatData(ambulance),
  });
});

export const listAmbulances = catchAsync(async (req, res, next) => {
  const ambulance = await Ambulance.findAll({
    order: [["createdAt", "DESC"]],
  });

  const formattedAmbulance = formatData(ambulance);

  return res.status(200).json({
    status: "success",
    data: formattedAmbulance,
  });
});
