import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";

// generateJWT Function
const generateJWT = (
  payload: JwtPayload,
  secret: string,
  expiresIn: string,
) => {
  const token = jwt.sign(payload, secret, {
    expiresIn,
  } as SignOptions);

  return token;
};

// verfyJWT Function
const verifyJWT = (token: string, secret: string) => {
  const verifiedToken = jwt.verify(token, secret);
  return verifiedToken;
};

export { generateJWT, verifyJWT };
