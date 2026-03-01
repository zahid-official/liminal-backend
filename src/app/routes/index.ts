import { Router } from "express";
import UserRoutes from "../modules/user/user.routes.js";

// Initialize router
const router = Router();

// Define module routes
const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
];

// Register module routes
moduleRoutes.forEach(({ path, route }) => {
  router.use(path, route);
});

// Export main router
const ModuleRouter: Router = router;
export default ModuleRouter;
