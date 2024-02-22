//external imports
import express from "express";

// internal imports
import doctorRouter from "./doctor.routes";

const router = express.Router();

router.get("/checkServer", (_, res) => res.sendStatus(200));

router.use("/", doctorRouter);

export default router;
