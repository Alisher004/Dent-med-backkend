const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { getAvailableSlots, createBooking, cancelBooking, listMyBookings, updateStatus } = require('../controllers/bookingController');

// Public - check slots
router.get('/available/:doctorId/:date', getAvailableSlots);

// Auth required
router.use(auth);
router.get('/me', listMyBookings);
router.post('/', createBooking);
router.put('/:id/cancel', cancelBooking);

// Admin actions
router.put('/:id/status', (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  next();
}, updateStatus);

module.exports = router;
