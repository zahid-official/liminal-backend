import { Router } from "express";
import schemaValidator from "../../middlewares/schemaValidator.js";
import UserController from "./user.controller.js";
import { createUserSchema, updateUserSchema } from "./user.validation.js";
import authGuard from "../../middlewares/authGuard.js";
import { Role } from "./user.interface.js";
import multerUpload from "../../middlewares/multer.js";

// Initialize router
const router = Router();

// Get routes
router.get(
  "/singleUser/:id",
  authGuard(Role.ADMIN),
  UserController.getSingleUser,
);

// Post routes
router.post(
  "/create",
  schemaValidator(createUserSchema),
  UserController.createUser,
);

// Patch routes
router.patch(
  "/:id",
  authGuard(Role.ADMIN),
  multerUpload.single("file"),
  schemaValidator(updateUserSchema),
  UserController.updateUser,
);

// Export user routes
const UserRoutes: Router = router;
export default UserRoutes;
