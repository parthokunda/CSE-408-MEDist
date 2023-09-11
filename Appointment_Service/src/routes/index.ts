//external imports
import express from "express";

// internal imports
import appointmentRouter from "./appointment.route";
import prescriptionRouter from "./prescription.routes";

const router = express.Router();

router.get("/checkServer", (_, res) => res.sendStatus(200));

router.use("/prescription", prescriptionRouter);

router.use("/", appointmentRouter);

export default router;
