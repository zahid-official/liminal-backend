import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import {
  Strategy as GoogleStrategy,
  type Profile,
  type VerifyCallback,
} from "passport-google-oauth20";
import User from "../modules/user/user.model.js";
import { Role, AccountStatus } from "../modules/user/user.interface.js";
import bcrypt from "bcryptjs";
import envVars from "./index.js";

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
        if (user?.isDeleted) {
          return done(null, false, {
            message: `User is deleted. Please contact support for more information.`,
          });
        }

        // Check if the user is blocked
        if (user?.status === AccountStatus.BLOCKED) {
          return done(null, false, {
            message: `User is ${user.status}. Please contact support for more information.`,
          });
        }

        // Compare the provided password with the stored hashed password
        const isPasswordMatched = await bcrypt.compare(
          password,
          user.password as string,
        );
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

// Configure the Google strategy for Passport
passport.use(
  new GoogleStrategy(
    // Google OAuth configuration
    {
      clientID: envVars.GOOGLE.CLIENT_ID,
      clientSecret: envVars.GOOGLE.CLIENT_SECRET,
      callbackURL: envVars.GOOGLE.CALLBACK_URL,
      proxy: true,
    },

    // Verification callback function
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback,
    ) => {
      try {
        // Extract relevant information from the Google profile
        const email = profile.emails?.[0]?.value;
        const googleId = profile.id;
        const name = profile.displayName;
        const profilePicture = profile.photos?.[0]?.value;

        // Check if the email is available in the profile
        if (!email) {
          return done(null, false, { message: "Email not found" });
        }

        // Find the user by email
        let user = await User.findOne({ email });

        // Check if the user is marked as deleted
        if (user && user.isDeleted) {
          return done(null, false, {
            message: `User is deleted. Please contact support for more information.`,
          });
        }

        // Check if the user is blocked
        if (user && user.status === AccountStatus.BLOCKED) {
          return done(null, false, {
            message: `User is ${user.status}. Please contact support for more information.`,
          });
        }

        // If the user doesn't exist, create a new user
        if (!user) {
          const payload = {
            email,
            name,
            role: Role.USER,
            isVerified: true,
            picture: profilePicture ?? "",
            auth: [{ provider: "google", providerId: googleId }],
          };

          // Create the user in the database
          user = await User.create(payload);
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
