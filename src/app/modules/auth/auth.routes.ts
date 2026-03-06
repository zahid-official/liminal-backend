import { Router } from "express";
import AuthController from "./auth.controller.js";

// Initialize router
const router = Router();

// Get routes
router.get("/google", AuthController.googleLogin);

// Post routes
router.post("/login", AuthController.credentialsLogin);
router.post("/logout", AuthController.logout);

// Export auth routes
const AuthRoutes: Router = router;
export default AuthRoutes;
