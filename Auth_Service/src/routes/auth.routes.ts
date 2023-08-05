//external imports
import express from "express";

// internal imports
import validateRequest from "./middleware/validateRequest";
import messageBroker from "../utils/broker";
import { config } from "../config";
import userService from "../services/user.service";
import authSchema from "schema/auth.schema";

const authRouter = express.Router();

// RPC observer
messageBroker.RPC_Observer(config.AUTH_RPC_QUEUE, userService);

// sign up
authRouter.post("/signup", validateRequest(authSchema.Signup_or_Login), );

export default authRouter;
