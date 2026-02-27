import type { Request, Response } from "express";
import { httpStatus } from "../imports/index.js";

// NotFoundErrorHandler Function
const notFoundErrorHandler = (req: Request, res: Response) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "Route not found",
    error: {
      name: "Route not found",
      message: "The requested route does not exist on the server",
      path: req.originalUrl,
      method: req.method,
    },
  });
};

export default notFoundErrorHandler;
