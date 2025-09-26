const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { listDoctors, getDoctor, updateDoctor } = require('../controllers/doctorController');

router.get('/', listDoctors);
router.get('/:id', getDoctor);

router.put('/:id', auth, (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  next();
}, updateDoctor);

module.exports = router;
