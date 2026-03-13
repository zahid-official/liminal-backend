import { createTransport } from "nodemailer";
import envVars from "../config/index.js";
import AppError from "../error/AppError.js";
import { httpStatus } from "../import/index.js";
import type { Attachment } from "nodemailer/lib/mailer/index.js";

// Define email options interface
interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  attachments?: Attachment[];
}

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

// Function to send email
const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    const mailOptions = {
      from: envVars.SMTP.FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
      attachments: options?.attachments?.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content,
        contentType: attachment.contentType,
      })),
    };

    await transporter.sendMail(mailOptions);
  } catch (error: any) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error.message || "Error sending email",
    );
  }
};

export default sendEmail;
