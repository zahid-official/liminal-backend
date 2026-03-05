import type { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";

const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

// Auth controller object
const AuthController = {
  credentialsLogin,
};

export default AuthController;
