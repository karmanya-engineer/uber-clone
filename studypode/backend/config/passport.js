const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Validate profile data
        if (!profile || !profile.id) {
          return done(new Error('Invalid Google profile data'), null);
        }

        if (!profile.emails || !profile.emails[0] || !profile.emails[0].value) {
          return done(new Error('Email not provided by Google'), null);
        }

        const email = profile.emails[0].value.toLowerCase().trim();
        const googleId = profile.id;
        const displayName = profile.displayName || profile.name?.givenName || 'User';

        // Check if user already exists with this Google ID
        let user = await User.findOne({ googleId });

        if (user) {
          // Update user info if needed
          if (!user.isEmailVerified) {
            user.isEmailVerified = true;
            await user.save();
          }
          return done(null, user);
        }

        // Check if user exists with this email
        user = await User.findOne({ email });

        if (user) {
          // Link Google account to existing user if not already linked
          if (!user.googleId) {
            user.googleId = googleId;
            user.isGoogleUser = true;
            user.isEmailVerified = true; // Google emails are already verified
            await user.save();
          }
          return done(null, user);
        }

        // Create new user
        user = new User({
          name: displayName,
          email: email,
          googleId: googleId,
          isGoogleUser: true,
          isEmailVerified: true, // Google emails are already verified
          phone: profile.phoneNumbers?.[0]?.value || '', // Optional for Google users
          role: 'user', // Default role
        });

        await user.save();
        console.log('New Google user created:', user.email);
        return done(null, user);
      } catch (error) {
        console.error('Google OAuth strategy error:', error);
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
