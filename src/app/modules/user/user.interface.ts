import type { Types } from "mongoose";

// Defines authentication provider interface
export interface IAuthProvider {
  provider: "google" | "credentials";
  providerId: string;
}

// Define user roles and statuses
export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
}
export enum AccountStatus {
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED",
}

// User interface definition
export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  address?: string;
  picture?: string;
  createdAt?: Date;
  isDeleted?: boolean;
  isVerified?: boolean;
  auth: IAuthProvider[];
  role: Role;
  status: AccountStatus;
}
