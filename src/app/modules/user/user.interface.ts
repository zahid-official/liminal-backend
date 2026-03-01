import type { Types } from "mongoose";

// Define user roles and statuses
export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
}
export enum UserStatus {
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED",
}

// User interface definition
export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  picture?: string;
  createdAt?: Date;
  isDeleted?: boolean;
  isVerified?: boolean;
  role: UserRole;
  status: UserStatus;
}
