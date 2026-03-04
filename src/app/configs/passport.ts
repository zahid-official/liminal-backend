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
        //
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, { message: "Invalid email or password" });
        }

        if (user.isDeleted) {
          return done(null, false, {
            message: `User is deleted. Please contact support for more information.`,
          });
        }

        if (user.status === UserStatus.BLOCKED) {
          return done(null, false, {
            message: `User is ${user.status}. Please contact support for more information.`,
          });
        }

        const matchPassword = await bcrypt.compare(password, user.password);
        if (!matchPassword) {
          return done(null, false, { message: "Invalid email or password" });
        }
        const { password: _password, ...safeUser } = user.toObject();

        return done(null, safeUser);
      } catch (error) {
        return done(error);
      }
    },
  ),
);
