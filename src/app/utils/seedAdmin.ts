/* eslint-disable no-console */
import bcrypt from "bcryptjs";
import envVars from "../config/index.js";
import { Role, type IUser } from "../modules/user/user.interface.js";
import User from "../modules/user/user.model.js";

// seedAdmin Function
const seedAdmin = async () => {
  try {
    const existingAdmin = await User.findOne<IUser>({
      email: envVars.DEFAULT_ADMIN_EMAIL,
    });

    // If admin already exists, do nothing
    if (existingAdmin) {
      return;
    }

    // Hash the default admin password
    const hashedPassword = await bcrypt.hash(
      envVars.DEFAULT_ADMIN_PASSWORD,
      envVars.BCRYPT_SALT_ROUNDS,
    );

    // Prepare the admin user payload
    const adminPayload = {
      name: "Default Admin",
      email: envVars.DEFAULT_ADMIN_EMAIL,
      password: hashedPassword,
      role: Role.ADMIN,
      isVerified: true,
      auth: [
        { provider: "credentials", providerId: envVars.DEFAULT_ADMIN_EMAIL },
      ],
    };

    // Create the default admin user in the database
    await User.create(adminPayload);
    console.log("✅ Default admin created successfully");
  } catch (error) {
    console.error("Failed to create default admin:", error);
  }
};

export default seedAdmin;
