import type { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import passport from "passport";
import AppError from "../../errors/AppError.js";
import { httpStatus } from "../../imports/index.js";
import getTokens from "../../utils/getTokens.js";
import { setCookies } from "../../utils/cookies.js";
import sendResponse from "../../utils/sendResponse.js";

// Credentials login
const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", async (error: any, user: any, info: any) => {
      // Handle authentication errors
      if (error) {
        return next(
          new AppError(
            httpStatus.UNAUTHORIZED,
            info?.message || "Authentication failed",
          ),
        );
      }

      // Handle invalid credentials
      if (!user) {
        return next(
          new AppError(
            httpStatus.UNAUTHORIZED,
            info?.message || "Invalid credentials",
          ),
        );
      }

      // Login the user & complete the authentication process
      req.logIn(user, (loginError: any) => {
        if (loginError) {
          return next(
            new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Login failed"),
          );
        }

        // Generate tokens and set cookies
        const tokens = getTokens(user);
        setCookies(res, tokens);

        // Exclude sensitive information from the user object
        const result = user.toObject();
        delete result.password;

        // Send response
        sendResponse(res, {
          success: true,
          statusCode: httpStatus.OK,
          message: "Credentials login successful",
          data: result,
        });
      });
    })(req, res, next);
  },
);

// Auth controller object
const AuthController = {
  credentialsLogin,
};

export default AuthController;
