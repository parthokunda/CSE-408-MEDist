import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";
import createError from "http-errors";
import log from "../../utils/logger";

const validateRequest =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      // parse the request body, query and params against the schema
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (err: any) {
      log.error("Error validating request: ", err);
      throw createError.BadRequest(err.errors[0]);
    }
  };

export default validateRequest;
