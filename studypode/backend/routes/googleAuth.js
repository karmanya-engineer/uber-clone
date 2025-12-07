const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Google OAuth callback
router.get(
  '/google/callback',
  passport.authenticate('google', { 
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=auth_failed`
  }),
  async (req, res) => {
    try {
      if (!req.user) {
        console.error('Google OAuth: No user found after authentication');
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        return res.redirect(`${frontendUrl}/login?error=user_not_found`);
      }

      const user = req.user;
      
      // Ensure user data is fresh from database
      const freshUser = await User.findById(user._id);
      if (!freshUser) {
        console.error('Google OAuth: User not found in database');
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        return res.redirect(`${frontendUrl}/login?error=user_not_found`);
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { userId: freshUser._id },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '7d' }
      );

      // Redirect to frontend with token
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const redirectUrl = `${frontendUrl}/auth/callback?token=${encodeURIComponent(token)}&role=${freshUser.role || 'user'}&name=${encodeURIComponent(freshUser.name || 'User')}`;
      
      console.log('Google OAuth success for user:', freshUser.email);
      res.redirect(redirectUrl);
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const errorMessage = error.message || 'Authentication failed';
      res.redirect(`${frontendUrl}/login?error=server_error&message=${encodeURIComponent(errorMessage)}`);
    }
  }
);

// Initiate Google OAuth
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

module.exports = router;
