import { createTransport } from "nodemailer";
import envVars from "../config/index.js";

// Configure SMTP transporter
const transporter = createTransport({
  host: envVars.SMTP.HOST,
  port: envVars.SMTP.PORT,
  secure: true,
  auth: {
    user: envVars.SMTP.USER,
    pass: envVars.SMTP.PASS,
  },
});
