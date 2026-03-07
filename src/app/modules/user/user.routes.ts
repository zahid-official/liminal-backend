import { Router } from "express";
import schemaValidator from "../../middlewares/schemaValidator.js";
import UserController from "./user.controller.js";
import { createUserSchema } from "./user.validation.js";
import authGuard from "../../middlewares/authGuard.js";
import { UserRole } from "./user.interface.js";

// Initialize router
const router = Router();

// Get routes
router.get(
  "/singleUser/:id",
  authGuard(UserRole.ADMIN),
  UserController.getSingleUser,
);

// Post routes
router.post(
  "/create",
  schemaValidator(createUserSchema),
  UserController.createUser,
);

// Export user routes
const UserRoutes: Router = router;
export default UserRoutes;
