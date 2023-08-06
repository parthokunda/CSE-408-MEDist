//external imports
import express from "express";

// internal imports
import patientRouter from "./patient.routes";

const router = express.Router();

router.get("/checkServer", (_, res) => res.sendStatus(200));

router.use("/api/patient", patientRouter);

export default router;
