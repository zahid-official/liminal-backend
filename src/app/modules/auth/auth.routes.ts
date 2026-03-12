import { Router } from "express";
import AuthController from "./auth.controller.js";
import passport from "passport";
import envVars from "../../config/index.js";
import schemaValidator from "../../middlewares/schemaValidator.js";
import { setPasswordZodSchema } from "./auth.validation.js";

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
  schemaValidator(setPasswordZodSchema),
  AuthController.setPassword,
);

// Export auth routes
const AuthRoutes: Router = router;
export default AuthRoutes;
