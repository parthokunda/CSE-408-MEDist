//external imports
import express from "express";

// internal imports
import validateRequest from "./middleware/validateRequest";
import { config } from "../config";
import patientService from "../services/patient.service";

const patientRouter = express.Router();



export default patientRouter;
