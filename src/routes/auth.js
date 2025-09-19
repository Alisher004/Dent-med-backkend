const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // email текшерүү
    const candidate = await User.findOne({ where: { email } });
    if (candidate) return res.status(400).json({ message: 'Email already exists' });

    // password хэш кылуу
    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, phone, passwordHash: hash });

    res.status(201).json({ message: 'User registered', userId: user.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ message: 'Wrong password' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;