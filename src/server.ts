/* eslint-disable no-console */
import type { Server } from "http";
import mongoose from "mongoose";
import envVars from "./app/config/index.js";
import app from "./app.js";

let server: Server;
const port = envVars.PORT || 5000;

// Initialize the server and connect to the database
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

// Start the server
bootstrap();

// Graceful shutdown handler
const handleShutdown = (signal: string, error?: unknown) => {
  const errorInfo = error ? { error } : {};

  console.error({
    message: `${signal} received. Server shutting down...`,
    ...errorInfo,
  });

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

// Unhandled promise rejection
process.on("unhandledRejection", (error) => {
  handleShutdown("Unhandled Rejection", error);
});

// Uncaught exceptions
process.on("uncaughtException", (error) => {
  handleShutdown("Uncaught Exception", error);
});

// Process termination signals
process.on("SIGTERM", () => handleShutdown("SIGTERM"));
process.on("SIGINT", () => handleShutdown("SIGINT"));
