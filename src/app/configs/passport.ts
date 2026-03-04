import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User from "../modules/user/user.model.js";
import { UserStatus } from "../modules/user/user.interface.js";
import bcrypt from "bcryptjs";

passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email: string, password: string, done: any) => {
      try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, { message: "Invalid email or password" });
        }

        // Check if the user is marked as deleted
        if (user.isDeleted) {
          return done(null, false, {
            message: `User is deleted. Please contact support for more information.`,
          });
        }

        // Check if the user is blocked
        if (user.status === UserStatus.BLOCKED) {
          return done(null, false, {
            message: `User is ${user.status}. Please contact support for more information.`,
          });
        }

        // Compare the provided password with the stored hashed password
        const matchPassword = await bcrypt.compare(password, user.password);
        if (!matchPassword) {
          return done(null, false, { message: "Invalid email or password" });
        }

        // Exclude the password field from the user object before returning it
        const { password: _password, ...safeUser } = user.toObject();
        return done(null, safeUser);
      } catch (error) {
        return done(error);
      }
    },
  ),
);
