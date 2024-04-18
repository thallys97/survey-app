const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const jwt = require('jsonwebtoken');

module.exports = function(passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'https://survey-api-app.vercel.app/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        const newUser = {
          googleId: profile.id,
          displayName: profile.displayName,
          email: profile.emails[0].value,
          // Outros campos conforme necessário
        };
        try {
          let user = await User.findOne({ googleId: profile.id });
          if (!user) {
            user = await User.create(newUser); // Create a new user if not found
          }
          // Generate the token for the user
          const payload = {
            id: user.id,
            displayName: user.displayName,
            email: user.email,
            role: user.role 
          };
          const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
      
          // Do not pass the token to done, handle the redirection here or outside of the strategy
          // You will handle the redirection in the route
          done(null, user);
        } catch (error) {
          console.error(error);
          done(error, null);
        }
      }
    )
  );

  // Serialize and deserialize user for session support
  // passport.serializeUser((user, done) => {
  //   done(null, user.id);
  // });

  // passport.deserializeUser(async (id, done) => {
  //   try {
  //     const user = await User.findById(id);
  //     done(null, user);
  //   } catch (err) {
  //     done(err);
  //   }
  // });
};