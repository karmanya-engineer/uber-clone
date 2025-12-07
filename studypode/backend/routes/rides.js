const express = require('express');
const Ride = require('../models/Ride');
const User = require('../models/User');
const axios = require('axios');
const auth = require('../middleware/auth');
const router = express.Router();

// Calculate distance and fare
const calculateDistance = async (pickup, dropoff) => {
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
      params: {
        origins: `${pickup.lat},${pickup.lng}`,
        destinations: `${dropoff.lat},${dropoff.lng}`,
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });

    const distance = response.data.rows[0].elements[0].distance.value / 1000; // in km
    const duration = response.data.rows[0].elements[0].duration.value / 60; // in minutes
    const baseFare = 2.5;
    const perKmRate = 1.5;
    const perMinuteRate = 0.3;
    const fare = baseFare + (distance * perKmRate) + (duration * perMinuteRate);

    return { distance, duration, fare };
  } catch (error) {
    // Fallback calculation if API fails
    const distance = Math.sqrt(
      Math.pow(dropoff.lat - pickup.lat, 2) + Math.pow(dropoff.lng - pickup.lng, 2)
    ) * 111; // Rough conversion
    const duration = distance * 2; // Rough estimate
    const fare = 5 + (distance * 1.5);
    return { distance, duration, fare };
  }
};

// All routes require authentication
router.use(auth);

// Create a ride
router.post('/', async (req, res) => {
  try {
    const { pickupLocation, dropoffLocation, paymentMethod } = req.body;

    const { distance, duration, fare } = await calculateDistance(pickupLocation, dropoffLocation);

    const ride = new Ride({
      passenger: req.user._id,
      pickupLocation,
      dropoffLocation,
      fare: Math.round(fare * 100) / 100,
      distance: Math.round(distance * 100) / 100,
      duration: Math.round(duration * 100) / 100,
      paymentMethod: paymentMethod || 'card',
    });

    await ride.save();

    // Populate passenger data
    const populatedRide = await Ride.findById(ride._id)
      .populate('passenger', 'name email phone');

    // Emit to drivers
    const io = req.app.get('io');
    io.emit('new-ride', populatedRide);

    res.status(201).json(populatedRide);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all rides for a user
router.get('/', async (req, res) => {
  try {
    const rides = await Ride.find({
      $or: [
        { passenger: req.user._id },
        { driver: req.user._id },
      ],
    })
      .populate('passenger', 'name email phone')
      .populate('driver', 'name email phone vehicleInfo')
      .sort({ createdAt: -1 });

    res.json(rides);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get available rides for drivers
router.get('/available', async (req, res) => {
  try {
    if (req.user.role !== 'driver') {
      return res.status(403).json({ message: 'Only drivers can view available rides' });
    }

    const rides = await Ride.find({
      status: 'pending',
    })
      .populate('passenger', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(rides);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Accept a ride (driver)
router.post('/:id/accept', async (req, res) => {
  try {
    if (req.user.role !== 'driver') {
      return res.status(403).json({ message: 'Only drivers can accept rides' });
    }

    const ride = await Ride.findById(req.params.id);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    if (ride.status !== 'pending') {
      return res.status(400).json({ message: 'Ride is not available' });
    }

    ride.driver = req.user._id;
    ride.status = 'driver-assigned';
    await ride.save();

    // Update driver availability
    await User.findByIdAndUpdate(req.user._id, { isAvailable: false });

    // Populate ride data before sending
    const populatedRide = await Ride.findById(ride._id)
      .populate('passenger', 'name email phone')
      .populate('driver', 'name email phone vehicleInfo');

    const io = req.app.get('io');
    io.to(`ride-${populatedRide._id}`).emit('ride-accepted', populatedRide);

    res.json(populatedRide);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start a ride
router.post('/:id/start', async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    if (ride.driver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only assigned driver can start the ride' });
    }

    ride.status = 'in-progress';
    await ride.save();

    const io = req.app.get('io');
    io.to(`ride-${ride._id}`).emit('ride-started', ride);

    res.json(ride);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Complete a ride
router.post('/:id/complete', async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    if (ride.driver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only assigned driver can complete the ride' });
    }

    ride.status = 'completed';
    await ride.save();

    // Update driver stats
    await User.findByIdAndUpdate(req.user._id, {
      isAvailable: true,
      $inc: { totalRides: 1 },
    });

    const io = req.app.get('io');
    io.to(`ride-${ride._id}`).emit('ride-completed', ride);

    res.json(ride);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cancel a ride
router.post('/:id/cancel', async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    if (ride.passenger.toString() !== req.user._id.toString() && 
        ride.driver?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    ride.status = 'cancelled';
    await ride.save();

    if (ride.driver) {
      await User.findByIdAndUpdate(ride.driver, { isAvailable: true });
    }

    const io = req.app.get('io');
    io.to(`ride-${ride._id}`).emit('ride-cancelled', ride);

    res.json(ride);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update driver location
router.post('/:id/location', async (req, res) => {
  try {
    const { lat, lng } = req.body;
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    ride.driverLocation = { lat, lng };
    await ride.save();

    const io = req.app.get('io');
    io.to(`ride-${ride._id}`).emit('driver-location-update', { rideId: ride._id, lat, lng });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
