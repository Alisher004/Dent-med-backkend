const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Doctor = sequelize.define('Doctor', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  phone: { type: DataTypes.STRING, allowNull: false },
  passwordHash: { type: DataTypes.STRING, allowNull: false },
  specialization: { type: DataTypes.STRING, allowNull: false },
  consultationFee: { type: DataTypes.DECIMAL(10,2), allowNull: false, defaultValue: 0 },
  availableDays: { type: DataTypes.JSON, allowNull: true, defaultValue: [] },
  availableHours: { type: DataTypes.JSON, allowNull: true, defaultValue: { start: '09:00', end: '17:00' } },
  isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
});

module.exports = Doctor;
