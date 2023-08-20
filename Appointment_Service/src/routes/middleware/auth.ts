import { Request, Response, NextFunction } from "express";
import {} from "../../utils/custom.d";

import createError from "http-errors";
import messageBroker, {
  RPC_Request_Payload,
  RPC_Response_Payload,
} from "../../utils/broker";
import { config } from "../../config";
import log from "../../utils/logger";

const authorize =
  (onlyPatient: boolean) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      //log.debug(token, "token");

      if (!token) {
        return next(createError.Unauthorized());
      }

      const payload: RPC_Request_Payload = {
        type: "AUTHORIZATION",
        data: {
          token: token,
        },
      };

      const auth_response_payload: RPC_Response_Payload =
        await messageBroker.RPC_Request(config.AUTH_RPC_QUEUE, payload);

      //log.debug(auth_response_payload, "auth_response_payload");

      if (auth_response_payload) {
        // success and valid token
        if (auth_response_payload.status === "success") {
          // set the user_identity in req.locals
          const role = auth_response_payload.data["role"];

          if (onlyPatient && role !== "patient")
            return next(createError.Unauthorized());

          req.user_identity = {
            id: auth_response_payload.data["id"],
            email: auth_response_payload.data["email"],
            role,
          };
          return next();
        }
        // error in auth service
        else if (auth_response_payload.status === "error")
          return next(createError.InternalServerError());

        // invalid token
        return next(createError.Unauthorized());
      }
      // error in message broker
      next(createError.InternalServerError("Error in message broker"));
    } catch (error) {
      next(error);
    }
  };

export default authorize;
