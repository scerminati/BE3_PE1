import passport from "passport";
import jwt from "passport-jwt";
import dotenv from "dotenv";

import userModel from "../DAO/Mongo/models/user.model.js";

dotenv.config();
const SECRET_PASSPORT = process.env.SECRET_PASSPORT;

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const cookieExtractor = (req) => {
  let token = null;

  // Extrae el token de la cookie 'jwt'
  if (req && req.cookies) {
    token = req.cookies.jwt;
  }

  return token;
};

const initializePassport = () => {
  passport.use(
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: SECRET_PASSPORT,
      },
      async (jwt_payload, done) => {
        try {
          const user = await userModel.findById(jwt_payload.id);
          if (user) {
            return done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await userModel.findById(id);
    done(null, user);
  });
};

export default initializePassport;
