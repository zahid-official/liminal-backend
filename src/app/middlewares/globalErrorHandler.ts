import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import envVars from "../configs/index.js";
import { httpStatus } from "../imports/index.js";

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

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = "Validation error. Please check the input data.";
    errorDetails = error.issues;
  }

  // Handle MongoDB duplicate key errors
  else if (error.code === 11000) {
    statusCode = httpStatus.BAD_REQUEST;
    message = `${Object.values(error.keyValue)} is already associated with an existing one. Please use another value.`;
  }

  // Handle MongoDB CastError for invalid ObjectIDs
  else if (error.name === "CastError") {
    statusCode = httpStatus.BAD_REQUEST;
    message = "Invalid ObjectID. Please provide a valid MongoDB ObjectID";
  }

  // JWT error handling
  else if (
    error.name === "JsonWebTokenError" ||
    error.name === "TokenExpiredError"
  ) {
    statusCode = httpStatus.UNAUTHORIZED;
    message = error.message;
  }

  // Send the error response
  res.status(statusCode).json({
    success: false,
    message,
    error: errorDetails,
    stack:
      envVars.NODE_ENV === "development"
        ? error.stack
            ?.split("\n")
            .map((line: any) => line.trim())
            .filter((line: any) => line.startsWith("at"))
        : null,
  });
};

export default globalErrorHandler;
