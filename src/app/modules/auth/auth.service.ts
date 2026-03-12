import type { JwtPayload } from "jsonwebtoken";
import envVars from "../../config/index.js";
import AppError from "../../error/AppError.js";
import { httpStatus } from "../../import/index.js";
import { regenerateToken } from "../../utils/getTokens.js";
import { verifyJWT } from "../../utils/jwt.js";
import { AccountStatus, type IAuthProvider } from "../user/user.interface.js";
import User from "../user/user.model.js";
import bcrypt from "bcryptjs";

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

// Set password
const setPassword = async (userId: string, password: string) => {
  // Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // Check if user has credentials auth provider, if not then they cannot set password
  if (
    !user.auth.some((auth) => auth.provider === "google") &&
    user.auth.some((auth) => auth.provider === "credentials")
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Only users without credentials auth provider can set password",
    );
  }

  // Check if user has google auth provider, if yes then they cannot set password
  if (user?.password && user?.auth.some((auth) => auth.provider === "google")) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Only users without google auth provider can set password",
    );
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(
    password,
    envVars.BCRYPT_SALT_ROUNDS,
  );

  // Create authentication provider entry
  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: user?.email,
  };

  // Update user with new password and auth provider
  user.password = hashedPassword;
  user.auth.push(authProvider);
  await user.save();

  return user;
};

// Auth service object
const AuthService = {
  regenerateAccessToken,
  setPassword,
};

export default AuthService;
