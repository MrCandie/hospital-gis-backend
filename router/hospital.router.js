import express from "express";
import {
  createHospital,
  findNearestAmbulance,
  listHospitals,
} from "../controller/hospital.controller.js";

const router = express.Router();

router.get("/", listHospitals);
router.post("/", createHospital);
router.post("/:id/find", findNearestAmbulance);

export default router;
