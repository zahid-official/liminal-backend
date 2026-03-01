import type { NextFunction, Request, Response } from "express";
import { httpStatus } from "../imports/index.js";
import envVars from "../configs/index.js";

// globalErrorHandler Function
const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // If headers are already sent, delegate to the default Express error handler
  if (res.headersSent) {
    return next(error);
  }

  // Set default status code and message if not provided
  let statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  let message = error.message || "Something went wrong!";
  let errorDetails = error;

  // Send the error response
  res.status(statusCode).json({
    message,
    error: errorDetails,
    stack: envVars.NODE_ENV === "development" ? error.stack : null,
  });
};

export default globalErrorHandler;
