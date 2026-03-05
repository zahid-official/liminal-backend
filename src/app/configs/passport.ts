import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User from "../modules/user/user.model.js";
import { UserStatus } from "../modules/user/user.interface.js";
import bcrypt from "bcryptjs";

// Configure the local strategy for Passport
passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email: string, password: string, done) => {
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
        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if (!isPasswordMatched) {
          return done(null, false, { message: "Invalid email or password" });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

// Serialize the user to store in the session
passport.serializeUser((user: any, done) => {
  return done(null, user._id);
});

// Deserialize the user from the session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id).select("-password");
    if (!user) {
      return done(null, false);
    }

    return done(null, user);
  } catch (error) {
    return done(error);
  }
});
