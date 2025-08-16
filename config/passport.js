const passport = require("passport");
var GoogleStrategy = require("passport-google-oauth20").Strategy;
const model = require("../models/index");

const callbackURL = process.env.NODE_ENV === "development" ? "http://localhost:5000/auth/google/callback" : "https://jwt-and-oauth2-0.onrender.com/auth/google/callback";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: callbackURL,
    },

    async function (accessToken, refreshToken, profile, done) {
      try {

        let user = await model.checkUsersByEmail(profile.emails[0].value);

        if(!user) {
          user = await model.createUserOAuth(profile.emails[0].value)
        }
        return done(null, user);

      } catch (err) {
        return done(err, null);
      }
    }
  )
);

module.exports = passport;
