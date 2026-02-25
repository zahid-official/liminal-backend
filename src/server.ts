import type { Server } from "http";
import mongoose from "mongoose";
import envVars from "./app/config/index.js";
import app from "./app.js";

let server: Server;
const port = envVars.PORT || 5000;

console.log(envVars.DB_URL);

const bootstrap = async () => {
  try {
    await mongoose.connect(envVars.DB_URL);

    server = app.listen(port, () => {
      console.log(`🚀 Server is running on http://localhost:${envVars.PORT}`);
      console.log(`⚙️  Environment: ${envVars.NODE_ENV}`);
    });
  } catch (error) {
    console.error({
      success: false,
      message: "Failed to connect to the database or start the server.",
      error,
    });
    process.exit(1);
  }
};

bootstrap();
