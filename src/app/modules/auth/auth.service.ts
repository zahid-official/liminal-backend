import type { JwtPayload } from "jsonwebtoken";
import envVars from "../../config/index.js";
import AppError from "../../error/AppError.js";
import { httpStatus } from "../../import/index.js";
import { regenerateToken } from "../../utils/getTokens.js";
import { verifyJWT } from "../../utils/jwt.js";
import { AccountStatus } from "../user/user.interface.js";
import User from "../user/user.model.js";

// Regenerate access token using refresh token
const regenerateAccessToken = async (refreshToken: string) => {
  // Check if refresh token is provided
  if (!refreshToken) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "No refresh token provided, authorization denied",
    );
  }

  // Verify the refresh token
  const verifiedToken = verifyJWT(
    refreshToken,
    envVars.JWT.REFRESH_SECRET,
  ) as JwtPayload;

  if (!verifiedToken) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Invalid refresh token, authorization denied",
    );
  }

  // Check if user exists
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

  // generate access token
  const accessToken = regenerateToken(user);
  return accessToken;
};

// Auth service object
const AuthService = {
  regenerateAccessToken,
};

export default AuthService;
