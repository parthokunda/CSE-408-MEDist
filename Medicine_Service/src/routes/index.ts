//external imports
import express from "express";

// internal imports
import medicineRouter from "./medicine.routes";

const router = express.Router();

router.get("/checkServer", (_, res) => res.sendStatus(200));

router.use("/", medicineRouter);


export default router;