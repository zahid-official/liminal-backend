import { createClient, type RedisClientType } from "redis";
import envVars from "./index.js";

// Create Redis client
const redisClient: RedisClientType = createClient({
  username: envVars.REDIS.USERNAME,
  password: envVars.REDIS.PASSWORD,
  socket: {
    host: envVars.REDIS.HOST,
    port: envVars.REDIS.PORT,
  },
});

// Handle Redis client errors
redisClient.on("error", (error) => {
  console.error("Redis Client Error", error);
});

// Function to connect to Redis
export const connectRedis = async (): Promise<void> => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  } catch (error) {
    console.error("❌ Could not connect to Redis:", error);
  }
};

export default redisClient;
