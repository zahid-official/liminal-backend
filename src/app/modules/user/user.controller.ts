import type { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import UserService from "./user.service.js";
import sendResponse from "../../utils/sendResponse.js";
import { httpStatus } from "../../imports/index.js";

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

// User controller object
const UserController = {
  createUser,
};

export default UserController;
