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

export default patientRouter;
