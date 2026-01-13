import express from "express";
import {
  createAmbulance,
  listAmbulances,
} from "../controller/ambulance.controller.js";

const router = express.Router();

router.get("/", listAmbulances);
router.post("/", createAmbulance);

export default router;
