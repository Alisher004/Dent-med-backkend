const express = require('express');
const router = express.Router();
const { getSettings, upsertSettings } = require('../controllers/settingsController');
const auth = require('../middlewares/auth');

// Public get
router.get('/', getSettings);

// Admin update
router.put('/', auth, (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  next();
}, upsertSettings);

module.exports = router;
