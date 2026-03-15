import crypto from "crypto";

// generateOtp Function
const generateOtp = (length: number = 6): string => {
  // Calculate the minimum and maximum values for the given length of OTP
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length);

  // Generate a random integer between min & max
  return crypto.randomInt(min, max).toString();
};

export default generateOtp;
