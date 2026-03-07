import { model, Schema } from "mongoose";
import {
  Role,
  AccountStatus,
  type IAuthProvider,
  type IUser,
} from "./user.interface.js";

// Define the authentication provider sub-schema
const authSchema = new Schema<IAuthProvider>(
  {
    provider: { type: "String", required: true },
    providerId: { type: "String", required: true },
  },
  {
    versionKey: false,
    _id: false,
  },
);

// Define the User schema
const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    phone: { type: String },
    address: { type: String },
    picture: { type: String },
    isDeleted: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    auth: [authSchema],
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
    },
    status: {
      type: String,
      enum: Object.values(AccountStatus),
      default: AccountStatus.ACTIVE,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

// Create User model from the schema
const User = model<IUser>("User", userSchema, "userCollection");
export default User;
