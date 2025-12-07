const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: function() {
      return !this.isGoogleUser;
    },
    minlength: [6, 'Password must be at least 6 characters long'],
  },
  phone: {
    type: String,
    required: function() {
      return !this.isGoogleUser;
    },
  },
  googleId: {
    type: String,
    sparse: true,
  },
  isGoogleUser: {
    type: Boolean,
    default: false,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationToken: {
    type: String,
  },
  emailVerificationExpires: {
    type: Date,
  },
  role: {
    type: String,
    enum: ['user', 'driver'],
    default: 'user',
  },
  vehicleInfo: {
    make: String,
    model: String,
    year: Number,
    licensePlate: String,
    color: String,
  },
  location: {
    lat: Number,
    lng: Number,
  },
  isAvailable: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 0,
  },
  totalRides: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

userSchema.pre('save', async function(next) {
  // Only hash password if it's modified and user is not a Google user
  if (this.isGoogleUser && !this.password) {
    // Google users don't need passwords
    return next();
  }
  
  if (!this.isModified('password')) {
    return next();
  }
  
  // Hash password if it exists and is not empty
  if (this.password && this.password.length > 0) {
    try {
      this.password = await bcrypt.hash(this.password, 10);
    } catch (error) {
      return next(error);
    }
  }
  
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) {
    return false;
  }
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    console.error('Password comparison error:', error);
    return false;
  }
};

module.exports = mongoose.model('User', userSchema);
