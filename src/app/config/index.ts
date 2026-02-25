import "dotenv/config";

// Interface for requiredEnvs
interface EnvConfig {
  DB_URL: string;
  PORT: number;
  NODE_ENV: "development" | "production";
}

// requiredEnvs Function
const requiredEnvs = (): EnvConfig => {
  const envKeys: string[] = ["DB_URL", "PORT", "NODE_ENV"];

  // Check if all required environment variables are defined
  envKeys.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(
        `Environment variable ${key} is required but not defined.`,
      );
    }
  });

  // Number validation helper function
  const assertNumber = (value: string, field: string) => {
    const num = Number(value);
    if (isNaN(num)) {
      throw new Error(`Environment variable ${field} must be a valid number.`);
    }
    return num;
  };

  // Return defined envs as an object
  return {
    DB_URL: process.env.DB_URL as string,
    PORT: assertNumber(process.env.PORT as string, "PORT"),
    NODE_ENV: process.env.NODE_ENV as "development" | "production",
  };
};

const envVars = requiredEnvs();
export default envVars;
