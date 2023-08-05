// external imports
import { NextFunction, Request, Response } from "express";

// internal imports
import { Signup_or_Login_Body_Input } from "schema/auth.schema";
import userService, { UserServiceInterface } from "../services/user.service";

interface Auth_Controller_Interface {
  signup(
    req: Request<{}, {}, Signup_or_Login_Body_Input>,
    res: Response,
    next: NextFunction
  );
}

class Auth_Controller implements Auth_Controller_Interface {
  // ------------------------------ signup ------------------------------
  async signup(
    req: Request<{}, {}, Signup_or_Login_Body_Input>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { email, password, role } = req.body;
      const { user, token } = await userService.SignUp({
        email,
        password,
        role,
      });
      res.status(201).json({ user, token });
    } catch (error) {
      next(error);
    }
  }
}
