//external imports
import express from "express";

// internal imports
import validateRequest from "./middleware/validateRequest";
import { config } from "../config";
import patientService from "../services/patient.service";
import authorize from "./middleware/auth";
import log from "../utils/logger";

const patientRouter = express.Router();

//home
patientRouter.get("/", authorize, (req, res) => {
  const { id, email, role } = req.user_identity;

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
