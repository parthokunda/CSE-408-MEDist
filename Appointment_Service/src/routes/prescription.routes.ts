//external imports
import express from "express";
import { Request, Response, NextFunction } from "express";
import {} from "../utils/custom.d";
import apicache from "apicache";
const cache = apicache.middleware;

// internal imports
import validateRequest from "./middleware/validateRequest";
import authorize from "./middleware/auth";

// schema instance
import prescriptionSchema from "../schema/prescription.schema";

// controller instance
import prescriptionController from "../controller/prescription.controller";

const prescriptionRouter = express.Router();

// generate prescription header - only accessible to all
prescriptionRouter.get(
  "/generate-prescription-header/:appointmentID",
  authorize(false, false),
  validateRequest(prescriptionSchema.Generate_Prescription_Header),
  cache("2 minutes"),
  prescriptionController.generatePrescriptionHeader
);

// create prescription - only accessible to doctor
prescriptionRouter.post(
  "/create-prescription/:appointmentID",
  authorize(false, true),
  validateRequest(prescriptionSchema.Create_Prescription),
  prescriptionController.createPrescription
);

// get prescription - only accessible to all
prescriptionRouter.get(
  "/get-prescription/:appointmentID",
  authorize(false, false),
  validateRequest(prescriptionSchema.Generate_Prescription_Header),
  cache("2 minutes"),
  prescriptionController.getPrescription
);

export default prescriptionRouter;
