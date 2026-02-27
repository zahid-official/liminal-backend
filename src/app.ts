import cookieParser from "cookie-parser";
import cors from "cors";
import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import envVars from "./app/configs/index.js";
import notFoundErrorHandler from "./app/middlewares/NotFoundErrorHandler.js";

// Initialize Express app
const app: Application = express();

// Middleware setup
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000", `${envVars.FRONTEND_URL}`],
    credentials: true,
  }),
);

// Root route
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the Liminal Server");
});

// Handle not found route
app.use(notFoundErrorHandler);

export default app;
