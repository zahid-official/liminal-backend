import bcrypt from "bcryptjs";
import type { JwtPayload } from "jsonwebtoken";
import envVars from "../../config/index.js";
import AppError from "../../error/AppError.js";
import { httpStatus } from "../../import/index.js";
import { generateResetToken, regenerateToken } from "../../utils/getTokens.js";
import { verifyJWT } from "../../utils/jwt.js";
import { AccountStatus, type IAuthProvider } from "../user/user.interface.js";
import User from "../user/user.model.js";
import sendEmail from "../../utils/sendEmail.js";

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

  // Check if user has credentials auth provider
  if (
    !user.auths.some((auth) => auth.provider === "google") &&
    user.auths.some((auth) => auth.provider === "credentials")
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Only users with google auth provider can set password",
    );
  }

  // Check if password is already set for users with google auth provider
  if (
    user?.password &&
    user?.auths.some((auth) => auth.provider === "google")
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Password is already set for this google account. Please login using credentials or google auth provider.",
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
  user.auths.push(authProvider);
  await user.save();

  return null;
};

// Change password
const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string,
) => {
  // Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // Check if password is set for the user
  if (!user.password) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Password is not set for this account. Please set a password first.",
    );
  }

  // Check if current password is correct
  const isMatchPassword = await bcrypt.compare(currentPassword, user.password);
  if (!isMatchPassword) {
    throw new AppError(httpStatus.BAD_REQUEST, "Current password is incorrect");
  }

  // Check if new password is the same as the current password
  if (currentPassword === newPassword) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "New password must be different from the current password.",
    );
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(
    newPassword,
    envVars.BCRYPT_SALT_ROUNDS,
  );

  // Update user with new password
  user.password = hashedPassword;
  await user.save();

  return null;
};

// Forgot password
const forgotPassword = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
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

  // Generate reset token
  const resetToken = generateResetToken(user);

  // Send password reset email
  await sendEmail({
    to: user.email,
    subject: "Password Reset",
    templateName: "forgotPassword",
    templateData: {
      recipientName: user.name,
      resetUrl: `${envVars.FRONTEND_URL}/reset-password?id=${user._id}&accessToken=${resetToken}`,
    },
  });

  return null;
};

// Auth service object
const AuthService = {
  regenerateAccessToken,
  setPassword,
  changePassword,
  forgotPassword,
};

export default AuthService;
