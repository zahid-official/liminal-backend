import type { NextFunction, Request, Response } from "express";
import type { JwtPayload } from "jsonwebtoken";
import envVars from "../configs/index.js";
import AppError from "../errors/AppError.js";
import { httpStatus } from "../imports/index.js";
import { AccountStatus } from "../modules/user/user.interface.js";
import User from "../modules/user/user.model.js";
import catchAsync from "../utils/catchAsync.js";
import { verifyJWT } from "../utils/jwt.js";

// It's a high-order function that returns a authGuard middleware function
const authGuard = (...allowedRoles: string[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    //
    const accessToken = req?.cookies?.accessToken;
    if (!accessToken) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "No access token provided, authorization denied.",
      );
    }

    //
    const verifiedToken = verifyJWT(
      accessToken,
      envVars.JWT.ACCESS_SECRET,
    ) as JwtPayload;
    if (!verifiedToken) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "Invalid access token, authorization denied.",
      );
    }

    // 
    const user = await User.findOne({
      email: verifiedToken?.email,
    });
    if (!user) {
      throw new AppError(httpStatus.UNAUTHORIZED, "User does not exist");
    }

    // Check if user is deleted
    if (user.isDeleted) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "User is deleted. Please contact support for more information.",
      );
    }

    // Check if user is blocked
    if (user.status === AccountStatus.BLOCKED) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        `User is ${user.status}. Please contact support for more information.`,
      );
    }

    // Check if user's role is allowed to access the resource
    if (allowedRoles.length && !allowedRoles.includes(verifiedToken.role)) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Forbidden: You don't have permission to access this resource.",
      );
    }

    req.decodedToken = verifiedToken;
    next();
  });
};

export default authGuard;
