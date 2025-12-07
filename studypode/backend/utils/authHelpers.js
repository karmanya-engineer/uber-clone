const crypto = require('crypto');

// Generate email verification token
const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Generate expiration date (24 hours from now)
const getVerificationExpiry = () => {
  return new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
};

module.exports = {
  generateVerificationToken,
  getVerificationExpiry,
};
