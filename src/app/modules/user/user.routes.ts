import { Router } from "express";
import UserController from "./user.controller.js";

// Initialize router
const router = Router();

router.post("/create", UserController.createUser);

// Export user routes
const UserRoutes: Router = router;
export default UserRoutes;
