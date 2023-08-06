//external imports
import express from "express";

// internal imports
import validateRequest from "./middleware/validateRequest";
import userService from "../services/user.service";
import authSchema from "../schema/auth.schema";
import authController from "../controller/auth.controller";

const authRouter = express.Router();



// sign up
authRouter.post("/signup", validateRequest(authSchema.Signup_or_Login), authController.signup);

// log in
authRouter.post("/login", validateRequest(authSchema.Signup_or_Login), authController.login);


export default authRouter;
