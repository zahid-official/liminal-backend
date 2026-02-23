import "dotenv/config";

// Interface for requiredEnvs
interface EnvConfig {
  PORT: string;
}

// requiredEnvs Function
const requiredEnvs = (): EnvConfig => {
  const envKeys: string[] = ["PORT"];

  // Check if all required environment variables are defined
  envKeys.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(
        `Environment variable ${key} is required but not defined.`,
      );
    }
  });

  // Return defined envs as an object
  return {
    PORT: process.env.PORT as string,
  };
};

const envVars = requiredEnvs();
export default envVars;
