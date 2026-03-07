import bcrypt from "bcryptjs";
import { Role, type IAuthProvider, type IUser } from "./user.interface.js";
import envVars from "../../configs/index.js";
import User from "./user.model.js";
import AppError from "../../errors/AppError.js";
import { httpStatus } from "../../imports/index.js";
import type { JwtPayload } from "jsonwebtoken";

// Create user
const createUser = async (payload: IUser, password: string) => {
  // Check if user with the same email already exists
  const existingUser = await User.findOne({ email: payload?.email });
  if (existingUser) {
    throw new AppError(
      httpStatus.CONFLICT,
      `User '${payload?.email}' already exists. Please use a different email.`,
    );
  }

  // Hash the password before saving
  const hashedPassword = await bcrypt.hash(
    password,
    envVars.BCRYPT_SALT_ROUNDS,
  );

  // Create authentication provider entry
  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: payload?.email,
  };

  // Create the user in the database
  const user = await User.create({
    ...payload,
    password: hashedPassword,
    auth: [authProvider],
  });

  const { password: _password, ...result } = user.toObject();
  return result;
};

// Get single user
const getSingleUser = async (userId: string) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  return user;
};

// Update user
const updateUser = async (
  userId: string,
  decodedToken: JwtPayload,
  payload: Partial<IUser>,
) => {
  // Ensure that users can only update their own profile unless they are an admin
  if (decodedToken?.role === Role.USER && decodedToken?.userId !== userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to update this user",
    );
  }

  // Check if user exists
  const existingUser = await User.findById(userId);
  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // Prevent users from changing their role unless they are an admin
  if (existingUser.role === Role.ADMIN && decodedToken?.role !== Role.ADMIN) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to change the role. Only admins can change roles.",
    );
  }

  // Prevent users from changing their role unless they are an admin
  if (payload.role && decodedToken?.role !== Role.ADMIN) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to change the role. Only admins can assign roles.",
    );
  }

  // Prevent users from changing their status unless they are an admin
  if (
    (payload.isDeleted || payload.isVerified || payload.status) &&
    decodedToken?.role !== Role.ADMIN
  ) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You don't have permission to change account status, delete status or verification status.",
    );
  }

  // Update the user in the database
  const updatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  }).select("-password");

  return updatedUser;
};

// User service object
const UserService = {
  createUser,
  getSingleUser,
  updateUser,
};

export default UserService;
