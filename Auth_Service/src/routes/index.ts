//external imports
import express from "express";

// internal imports
import authRouter from "./auth.routes";

const router = express.Router();

router.get("/checkServer", (_, res) => res.sendStatus(200));

router.use("/", authRouter);

export default router;
