const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// All routes require authentication
router.use(auth);

// Get current user
router.get('/me', async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user location
router.put('/location', async (req, res) => {
  try {
    const { lat, lng } = req.body;
    await User.findByIdAndUpdate(req.user._id, {
      location: { lat, lng },
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update driver availability
router.put('/availability', auth, async (req, res) => {
  try {
    if (req.user.role !== 'driver') {
      return res.status(403).json({ message: 'Only drivers can update availability' });
    }

    const { isAvailable } = req.body;
    await User.findByIdAndUpdate(req.user._id, { isAvailable });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get nearby drivers
router.get('/drivers', async (req, res) => {
  try {
    const { lat, lng } = req.query;
    
    const drivers = await User.find({
      role: 'driver',
      isAvailable: true,
    }).select('name location vehicleInfo rating totalRides');

    // Filter drivers within reasonable distance (simplified)
    const nearbyDrivers = drivers.filter(driver => {
      if (!driver.location || !lat || !lng) return false;
      const distance = Math.sqrt(
        Math.pow(driver.location.lat - parseFloat(lat), 2) +
        Math.pow(driver.location.lng - parseFloat(lng), 2)
      ) * 111; // Rough km conversion
      return distance < 10; // Within 10km
    });

    res.json(nearbyDrivers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
