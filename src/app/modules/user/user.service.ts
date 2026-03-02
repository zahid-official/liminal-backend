import bcrypt from "bcryptjs";
import type { IAuthProvider, IUser } from "./user.interface.js";
import envVars from "../../configs/index.js";
import User from "./user.model.js";
import AppError from "../../errors/AppError.js";
import { httpStatus } from "../../imports/index.js";

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

// User service object
const UserService = {
  createUser,
};

export default UserService;
