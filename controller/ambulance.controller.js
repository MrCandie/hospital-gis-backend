import Ambulance from "../models/ambulance.js";
import AppError from "../utils/app-error.js";
import catchAsync from "../utils/catch-async.js";

// const nearbyAmbulances = [
//   {
//     name: "Lagos State Ambulance Service (LASAMBUS) – Yaba",
//     lat: 6.5059,
//     lng: 3.3753,
//   },
//   {
//     name: "St John Ambulance – LUTH",
//     lat: 6.5259,
//     lng: 3.3962,
//   },
//   {
//     name: "LUTH Emergency Ambulance Unit",
//     lat: 6.5258,
//     lng: 3.396,
//   },
//   {
//     name: "Adeleye’s Signature Ambulance Service",
//     lat: 6.5182,
//     lng: 3.3857,
//   },
//   {
//     name: "HelpOS Ambulance Service – Surulere",
//     lat: 6.4955,
//     lng: 3.3553,
//   },
//   {
//     name: "LASAMBUS Emergency Point – Ilupeju",
//     lat: 6.5486,
//     lng: 3.3564,
//   },
//   {
//     name: "Braingrace Ambulance Service",
//     lat: 6.5273,
//     lng: 3.3476,
//   },
//   {
//     name: "Emergency Rescue Ambulance – Gbagada",
//     lat: 6.5565,
//     lng: 3.3889,
//   },
// ];

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

  // const allLocations = nearbyAmbulances.map((el) => {
  //   return {
  //     name: el.name,
  //     location: {
  //       type: "Point",
  //       coordinates: [Number(el.lat), Number(el.lng)],
  //     },
  //   };
  // });

  // await Ambulance.bulkCreate(allLocations);

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
