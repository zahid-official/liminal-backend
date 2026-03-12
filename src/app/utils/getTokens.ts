import envVars from "../config/index.js";
import type { IUser } from "../modules/user/user.interface.js";
import { generateJWT } from "./jwt.js";

// Create jwt payload
const getJwtPayload = (user: Partial<IUser>) => {
  return {
    userId: user._id,
    email: user.email,
    role: user.role,
  };
};

// getTokens Function
const getTokens = (user: Partial<IUser>) => {
  // Generate Access Token
  const accessToken = generateJWT(
    getJwtPayload(user),
    envVars.JWT.ACCESS_SECRET,
    envVars.JWT.ACCESS_EXPIRESIN,
  );

  // Generate Refresh Token
  const refreshToken = generateJWT(
    getJwtPayload(user),
    envVars.JWT.REFRESH_SECRET,
    envVars.JWT.REFRESH_EXPIRESIN,
  );

  return { accessToken, refreshToken };
};

// Regenerate access token only
export const regenerateToken = (user: Partial<IUser>) => {
  // Generate Access Token
  const accessToken = generateJWT(
    getJwtPayload(user),
    envVars.JWT.ACCESS_SECRET,
    envVars.JWT.ACCESS_EXPIRESIN,
  );

  return { accessToken };
};

export default getTokens;
