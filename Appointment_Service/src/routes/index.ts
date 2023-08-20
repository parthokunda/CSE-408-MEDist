//external imports
import express from "express";

// internal imports
import appointmentRouter from "./appointment.route";

const router = express.Router();

router.get("/checkServer", (_, res) => res.sendStatus(200));

router.use("/", appointmentRouter);

export default router;
