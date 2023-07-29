import { Request, Response, NextFunction } from "express";
import createError, { HttpError } from "http-errors";

// 404 handler
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("404 handler called.");
  next(createError(404, "Resource not found."));
};

// default error handler

export const defaultErrorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Default error handler called.");
  console.log("Path:", req.path);
  console.error("Error occured:", err);

  res.status(err.status || 500);
  res.json({
    errors: {
      message: err.message,
    },
  });
};
