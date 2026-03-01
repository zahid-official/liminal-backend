import { model, Schema } from "mongoose";
import { UserRole, UserStatus, type IUser } from "./user.interface.js";

// Define the User schema
const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    picture: { type: String },
    isDeleted: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.ACTIVE,
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
