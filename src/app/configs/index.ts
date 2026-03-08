import "dotenv/config";

// Interface for requiredEnvs
interface EnvConfig {
  DB_URL: string;
  PORT: number;
  NODE_ENV: "development" | "production";
  FRONTEND_URL: string;

  DEFAULT_ADMIN_EMAIL: string;
  DEFAULT_ADMIN_PASSWORD: string;

  BCRYPT_SALT_ROUNDS: number;
  EXPRESS_SESSION_SECRET: string;

  JWT: {
    ACCESS_SECRET: string;
    ACCESS_EXPIRESIN: string;
    REFRESH_SECRET: string;
    REFRESH_EXPIRESIN: string;
  };

  GOOGLE: {
    CLIENT_ID: string;
    CLIENT_SECRET: string;
    CALLBACK_URL: string;
  };

  CLOUDINARY: {
    API_KEY: string;
    API_SECRET: string;
    CLOUD_NAME: string;
  };
}

// requiredEnvs Function
const requiredEnvs = (): EnvConfig => {
  const envKeys: string[] = [
    "DB_URL",
    "PORT",
    "NODE_ENV",
    "FRONTEND_URL",

    "DEFAULT_ADMIN_EMAIL",
    "DEFAULT_ADMIN_PASSWORD",

    "BCRYPT_SALT_ROUNDS",
    "EXPRESS_SESSION_SECRET",

    "JWT_ACCESS_SECRET",
    "JWT_ACCESS_EXPIRESIN",
    "JWT_REFRESH_SECRET",
    "JWT_REFRESH_EXPIRESIN",

    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_CALLBACK_URL",

    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
    "CLOUDINARY_CLOUD_NAME",
  ];

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
    FRONTEND_URL: process.env.FRONTEND_URL as string,

    DEFAULT_ADMIN_EMAIL: process.env.DEFAULT_ADMIN_EMAIL as string,
    DEFAULT_ADMIN_PASSWORD: process.env.DEFAULT_ADMIN_PASSWORD as string,

    BCRYPT_SALT_ROUNDS: assertNumber(
      process.env.BCRYPT_SALT_ROUNDS as string,
      "BCRYPT_SALT_ROUNDS",
    ),
    EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET as string,

    JWT: {
      ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
      ACCESS_EXPIRESIN: process.env.JWT_ACCESS_EXPIRESIN as string,
      REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
      REFRESH_EXPIRESIN: process.env.JWT_REFRESH_EXPIRESIN as string,
    },

    GOOGLE: {
      CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
      CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
      CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL as string,
    },

    CLOUDINARY: {
      API_KEY: process.env.CLOUDINARY_API_KEY as string,
      API_SECRET: process.env.CLOUDINARY_API_SECRET as string,
      CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
    },
  };
};

const envVars = requiredEnvs();
export default envVars;
