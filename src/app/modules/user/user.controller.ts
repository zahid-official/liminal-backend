import type { Request, Response } from "express";
import { httpStatus } from "../../imports/index.js";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import UserService from "./user.service.js";
import type { IUser } from "./user.interface.js";

// Create user
const createUser = catchAsync(async (req: Request, res: Response) => {
  const { password, ...payload } = req?.body || {};
  const result = await UserService.createUser(payload, password);

  // Send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User created successfully",
    data: result,
  });
});

// Get single user
const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params?.id as string;
  const result = await UserService.getSingleUser(userId);

  // Send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User retrieved successfully",
    data: result,
  });
});

// Update user
const updateUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params?.id as string;
  const decodedToken = req?.decodedToken;
  const body: IUser = { ...req?.body, picture: req.file?.path };
  const result = await UserService.updateUser(userId, decodedToken, body);

  // Send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User updated successfully",
    data: result,
  });
});

// Delete user
const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params?.id as string;
  const result = await UserService.deleteUser(userId);

  // Send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User deleted successfully",
    data: result,
  });
});

// User controller object
const UserController = {
  createUser,
  getSingleUser,
  updateUser,
  deleteUser,
};

export default UserController;
