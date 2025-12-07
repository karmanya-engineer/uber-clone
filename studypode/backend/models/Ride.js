const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  passenger: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  pickupLocation: {
    address: String,
    lat: Number,
    lng: Number,
  },
  dropoffLocation: {
    address: String,
    lat: Number,
    lng: Number,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'driver-assigned', 'in-progress', 'completed', 'cancelled'],
    default: 'pending',
  },
  fare: {
    type: Number,
    default: 0,
  },
  distance: {
    type: Number,
    default: 0,
  },
  duration: {
    type: Number,
    default: 0,
  },
  driverLocation: {
    lat: Number,
    lng: Number,
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card'],
    default: 'card',
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  review: String,
}, {
  timestamps: true,
});

module.exports = mongoose.model('Ride', rideSchema);
