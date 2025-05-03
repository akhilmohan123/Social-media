const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const usermodel = require("../model/usermodel");
require("dotenv").config();

const googleAuthMiddleWare = {
  initialize: (passport) => {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: "http://localhost:3001/auth/google/callback"
        },
        async(accessToken, refreshToken, profile, done) => {
          console.log(profile.emails[0].value)
          console.log(profile.photos[0].value)
          const email=profile.emails[0].value;
          let existingUser = await usermodel.findOne({ Email:email });
           console.log(existingUser)
              if(existingUser){
                return done(null,existingUser)
              }else{
                const newUser = new usermodel({
                  Fname: profile.displayName,
                  Email: profile.emails[0].value,
                  Image: profile.photos[0].value,
                  googleId: profile.id,
                  authType: "google",
                  Password: null // clearly indicate it's a Google login
                });
                await newUser.save();
      return done(null, newUser);
              }


        }
      )
    );

    // REMOVE session-based behavior
    // passport.serializeUser((user, done) => done(null, user));
    // passport.deserializeUser((user, done) => done(null, user));
  },

  authenticate: () =>
    passport.authenticate("google", {
      scope: ["profile", "email"],
      session: false
    }),

  callback: () =>
    passport.authenticate("google", {
      failureRedirect: "http://localhost:5173/login",
      session: false
    })
};



module.exports = {
  googleAuthMiddleWare
};
