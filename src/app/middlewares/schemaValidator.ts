import type { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync.js";
import type { ZodObject } from "zod";

// schemaValidator Function
const schemaValidator = (schema: ZodObject) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // If the request body contains a "data" property, use it as the new request body
    if (req?.body?.data) {
      req.body = req.body.data;
    }

    // Validate request body against the provided schema
    req.body = await schema.parseAsync(req?.body);
    next();
  });
};

export default schemaValidator;
