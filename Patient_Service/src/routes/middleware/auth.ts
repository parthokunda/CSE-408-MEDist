import { Request ,Response, NextFunction } from "express";
import { } from "../../utils/custom.d"

import createError from "http-errors";
import messageBroker, {
  RPC_Request_Payload,
  RPC_Response_Payload,
} from "../../utils/broker";
import { config } from "../../config";

const authorize = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw createError.Unauthorized();
    }

    const payload: RPC_Request_Payload = {
      type: "AUTHORIZATION",
      data: {
        token: token,
      },
    };

    const auth_response_payload: RPC_Response_Payload =
      await messageBroker.RPC_Request(config.AUTH_RPC_QUEUE, payload);

    if (auth_response_payload) {
      // success and valid token
      if (auth_response_payload.status === "success") {
        // set the user_identity in req.locals
        req.user_identity = {
          id: auth_response_payload.data["id"],
          email: auth_response_payload.data["email"],
          role: auth_response_payload.data["role"],
        };
        next();
      }
      // error in auth service
      else if (auth_response_payload.status === "error")
        throw createError.InternalServerError();
      // token expired or invalid
      else if (auth_response_payload.status === "unauthorized")
        throw createError.Unauthorized();
    }
    // error in message broker
    else throw createError.InternalServerError();
  } catch (error) {
    next(error);
  }
};

export default authorize;
