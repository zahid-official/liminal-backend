import envVars from "../config/index.js";
import type { IUser } from "../modules/user/user.interface.js";
import { generateJWT } from "./jwt.js";

// getTokens Function
const getTokens = (user: Partial<IUser>) => {
  // Create JWT Payload
  const jwtPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };

  // Generate Access Token
  const accessToken = generateJWT(
    jwtPayload,
    envVars.JWT.ACCESS_SECRET,
    envVars.JWT.ACCESS_EXPIRESIN,
  );

  // Generate Refresh Token
  const refreshToken = generateJWT(
    jwtPayload,
    envVars.JWT.REFRESH_SECRET,
    envVars.JWT.REFRESH_EXPIRESIN,
  );

  return { accessToken, refreshToken };
};

export default getTokens;
