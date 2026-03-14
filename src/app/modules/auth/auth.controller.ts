import type { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import passport from "passport";
import AppError from "../../error/AppError.js";
import { httpStatus } from "../../import/index.js";
import getTokens from "../../utils/getTokens.js";
import { clearCookies, setCookies } from "../../utils/cookies.js";
import sendResponse from "../../utils/sendResponse.js";
import envVars from "../../config/index.js";
import AuthService from "./auth.service.js";

// Google login
const googleLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const redirect = (req?.query?.redirect as string) || "/";

    // Initiate Google authentication with Passport
    passport.authenticate("google", {
      scope: ["profile", "email"],
      state: redirect,
    })(req, res, next);
  },
);

// Google login callback
const googleLoginCallback = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    // Extract the redirect path from the state parameter
    let redirect = req.query.state ? (req.query.state as string) : "";
    if (redirect.startsWith("/")) {
      redirect = redirect.slice(1);
    }

    // Handle authentication failure
    if (!user) {
      return next(
        new AppError(httpStatus.UNAUTHORIZED, "Google authentication failed"),
      );
    }

    // Generate tokens and set cookies
    const tokens = getTokens(user);
    setCookies(res, tokens);

    // Redirect the user to the specified path or the homepage
    res.redirect(`${envVars.FRONTEND_URL}/${redirect}`);
  },
);

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

// Logout user
const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Logout the user
    req.logout((error) => {
      if (error) {
        return next(
          new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Logout failed"),
        );
      }

      req.session.destroy((sessionError) => {
        if (sessionError) {
          return next(
            new AppError(
              httpStatus.INTERNAL_SERVER_ERROR,
              "Session destruction failed",
            ),
          );
        }

        // Clear cookies
        clearCookies(res);

        // Send response
        sendResponse(res, {
          success: true,
          statusCode: httpStatus.OK,
          message: "User logged out successfully",
          data: null,
        });
      });
    });
  },
);

// Regenerate access token
const regenerateAccessToken = catchAsync(
  async (req: Request, res: Response) => {
    const refreshToken = req?.cookies?.refreshToken;
    const result = await AuthService.regenerateAccessToken(refreshToken);

    // Set access-token cookie
    setCookies(res, result);

    // Send response
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Access token regenerated successfully",
      data: null,
    });
  },
);

// Set password
const setPassword = catchAsync(async (req: Request, res: Response) => {
  const password = req?.body?.password;
  const userId = req?.decodedToken?.userId;
  const result = await AuthService.setPassword(userId, password);

  // Send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Password set successfully",
    data: result,
  });
});

// Change password
const changePassword = catchAsync(async (req: Request, res: Response) => {
  const userId = req?.decodedToken?.userId;
  const { currentPassword, newPassword } = req?.body || {};
  const result = await AuthService.changePassword(
    userId,
    currentPassword,
    newPassword,
  );

  // Send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Password changed successfully",
    data: result,
  });
});

// Forgot password
const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const email = req?.body?.email;
  const result = await AuthService.forgotPassword(email);

  // Send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Password reset email sent successfully",
    data: result,
  });
});

// Reset password
const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const userId = req?.decodedToken?.userId;
  const { id, newPassword } = req?.body || {};
  const result = await AuthService.resetPassword(userId, id, newPassword);

  // Send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Password reset successfully",
    data: result,
  });
});

// Send OTP
const sendOTP = catchAsync(async (req: Request, res: Response) => {
  const email = req?.body?.email;
  const result = await AuthService.sendOTP(email);

  // Send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "OTP sent successfully",
    data: result,
  });
});

// Auth controller object
const AuthController = {
  googleLogin,
  googleLoginCallback,
  credentialsLogin,
  logout,
  regenerateAccessToken,
  setPassword,
  changePassword,
  forgotPassword,
  resetPassword,
  sendOTP,
};

export default AuthController;
