const sequelize = require('../config/db');
const User = require('./User');
const Doctor = require('./Doctor');
const Booking = require('./Booking');
const Service = require('./Service');
const ClinicSettings = require('./ClinicSettings');

// Associations
User.hasMany(Booking, { foreignKey: 'userId', as: 'bookings' });
Booking.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Doctor.hasMany(Booking, { foreignKey: 'doctorId', as: 'bookings' });
Booking.belongsTo(Doctor, { foreignKey: 'doctorId', as: 'doctor' });

module.exports = { sequelize, User, Doctor, Booking, Service, ClinicSettings };
