import { Router } from "express";
import passport from "passport";
import envVars from "../../config/index.js";
import authGuard from "../../middlewares/authGuard.js";
import schemaValidator from "../../middlewares/schemaValidator.js";
import { Role } from "../user/user.interface.js";
import AuthController from "./auth.controller.js";
import {
  changePasswordZodSchema,
  forgotPasswordZodSchema,
  resetPasswordZodSchema,
  sendOtpZodSchema,
  setPasswordZodSchema,
  verifyOtpZodSchema,
} from "./auth.validation.js";

// Initialize router
const router = Router();

// Get routes
router.get("/google", AuthController.googleLogin);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${envVars.FRONTEND_URL}/login?errorMessage=There was an error during Google authentication. Please try again.`,
  }),
  AuthController.googleLoginCallback,
);

// Post routes
router.post("/login", AuthController.credentialsLogin);
router.post("/logout", AuthController.logout);
router.post("/regenerate-token", AuthController.regenerateAccessToken);

// Patch routes
router.patch(
  "/set-password",
  authGuard(...Object.values(Role)),
  schemaValidator(setPasswordZodSchema),
  AuthController.setPassword,
);
router.patch(
  "/change-password",
  authGuard(...Object.values(Role)),
  schemaValidator(changePasswordZodSchema),
  AuthController.changePassword,
);
router.patch(
  "/forgot-password",
  schemaValidator(forgotPasswordZodSchema),
  AuthController.forgotPassword,
);
router.patch(
  "/reset-password",
  authGuard(...Object.values(Role)),
  schemaValidator(resetPasswordZodSchema),
  AuthController.resetPassword,
);
router.patch(
  "/send-otp",
  schemaValidator(sendOtpZodSchema),
  AuthController.sendOTP,
);
router.patch(
  "/verify-otp",
  schemaValidator(verifyOtpZodSchema),
  AuthController.verifyOTP,
);

// Export auth routes
const AuthRoutes: Router = router;
export default AuthRoutes;
