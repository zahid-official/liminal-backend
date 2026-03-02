import { Router } from "express";
import UserController from "./user.controller.js";
import { createUserSchema } from "./user.validation.js";
import schemaValidator from "../../middlewares/schemaValidator.js";

// Initialize router
const router = Router();

router.post(
  "/create",
  schemaValidator(createUserSchema),
  UserController.createUser,
);

// Export user routes
const UserRoutes: Router = router;
export default UserRoutes;
