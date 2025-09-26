const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
require('dotenv').config();
const sequelize = require('./src/config/db');

// Ensure models are loaded
require('./src/models/User');
require('./src/models/Doctor');
require('./src/models/Booking');
require('./src/models/Service');
require('./src/models/ClinicSettings');
require('./src/models/index');

// Routes
const authRoutes = require('./src/routes/auth');
const doctorRoutes = require('./src/routes/doctor');
const bookingRoutes = require('./src/routes/booking');
const settingsRoutes = require('./src/routes/settings');

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/settings', settingsRoutes);

app.get('/api/health', (req, res) => res.json({ ok: true }));

sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  const ClinicSettings = require("./src/models/ClinicSettings");
  ClinicSettings.findOrCreate({ where: { id: 1 }, defaults: { id: 1 } });
});
