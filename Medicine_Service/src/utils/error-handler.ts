import { Request, Response, NextFunction } from "express";
import createError, { HttpError } from "http-errors";

//internal imports
import log from "./logger";

// 404 handler
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  log.error("404 handler called.");
  next(createError(404, "Page Not Found."));
};

// default error handler

export const defaultErrorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  log.error("Default error handler called.");
  log.trace(`request path: ${req.path}`);
  log.trace(err, "Error occured:");

  res.status(err.status || 500);
  res.json({
    error: {
      ...err,
    }
  });
};
