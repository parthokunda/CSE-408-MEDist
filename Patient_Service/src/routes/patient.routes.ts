//external imports
import express from "express";
import { Request, Response, NextFunction } from "express";
import {} from "../utils/custom.d";

// internal imports
import validateRequest from "./middleware/validateRequest";
import { config } from "../config";
import patientService from "../services/patient.service";
import authorize from "./middleware/auth";
import log from "../utils/logger";
import uploadImage from "./middleware/imageUpload";

import patientSchema from "../schema/patient.schema";
import patientController from "../controller/patient.controller";

const patientRouter = express.Router();

//home
patientRouter.get("/", authorize, (req: Request, res: Response) => {
  const id = req.user_identity?.id;
  const email = req.user_identity?.email;
  const role = req.user_identity?.role;

  log.info(
    `User with ID: ${id} and email: ${email} and role: ${role} accessed the home route`
  );
  res.status(200).json({
    id,
    email,
    role,
  });
});

// image upload
patientRouter.post(
  "/upload-image",
  authorize,
  uploadImage,
  patientController.uploadImage
);

// get patient info
patientRouter.get("/profile-info", authorize, patientController.getPatientInfo);

// update patient info
patientRouter.put(
  "/update-info",
  authorize,
  uploadImage,
  validateRequest(patientSchema.Update_Patient_Info),
  patientController.updatePatientInfo
);

export default patientRouter;
