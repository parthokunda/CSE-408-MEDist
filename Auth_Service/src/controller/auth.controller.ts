// external imports
import { NextFunction, Request, Response } from "express";

// internal imports
import { Signup_or_Login_Body_Input } from "schema/auth.schema";
import userService, { UserServiceInterface } from "../services/user.service";
import broker from "utils/broker";
import { config } from "config";

interface SignUp_or_Login_Response {
  token: string;
}

interface Auth_Controller_Interface {
  signup(
    req: Request<{}, {}, Signup_or_Login_Body_Input>,
    res: Response,
    next: NextFunction
  );

  login(
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

      const response_token = await userService.SignUp({
        email,
        password,
        role,
      });

      const response: SignUp_or_Login_Response = {
        token: response_token,
      };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  // ---------------------------- Login -----------------------------------
  async login(
    req: Request<{}, {}, Signup_or_Login_Body_Input>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { email, password, role } = req.body;

      const response_token = await userService.LogIn({
        email,
        password,
        role,
      });

      const response: SignUp_or_Login_Response = {
        token: response_token,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  // ---------------------------- Logout -----------------------------------
  async logout(req: Request, res: Response, next: NextFunction) {

  }
}

export default new Auth_Controller();
