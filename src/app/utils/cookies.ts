import type { CookieOptions, Response } from "express";
import envVars from "../config/index.js";

// Auth tokens interface
interface IAuthTokens {
  accessToken: string;
  refreshToken?: string;
}

// Cookie options
const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: envVars.NODE_ENV === "production",
  sameSite: envVars.NODE_ENV === "production" ? "none" : "lax",
  path: "/",
};

// Set cookies function
const setCookies = (res: Response, tokenInfo: IAuthTokens) => {
  // Set access-token cookie
  if (tokenInfo.accessToken) {
    res.cookie("accessToken", tokenInfo.accessToken, {
      ...cookieOptions,
      maxAge: 23 * 60 * 60 * 1000, // 23 hours
    });
  }

  // Set refresh-token cookie
  if (tokenInfo.refreshToken) {
    res.cookie("refreshToken", tokenInfo.refreshToken, {
      ...cookieOptions,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
  }
};

// Clear cookies function
const clearCookies = (res: Response) => {
  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);
  res.clearCookie("connect.sid", { path: "/" });
};

export { setCookies, clearCookies };
