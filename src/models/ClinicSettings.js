const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ClinicSettings = sequelize.define('ClinicSettings', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  workingDays: { type: DataTypes.JSON, allowNull: false, defaultValue: [1,2,3,4,5] }, // 0=Sun ... 6=Sat
  startTime: { type: DataTypes.STRING, allowNull: false, defaultValue: '09:00' },
  endTime: { type: DataTypes.STRING, allowNull: false, defaultValue: '17:00' },
  slotIntervalMin: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 30 },
  timezone: { type: DataTypes.STRING, allowNull: false, defaultValue: 'UTC' },
  holidays: { type: DataTypes.JSON, allowNull: false, defaultValue: [] } // ["2025-12-31", ...]
});

module.exports = ClinicSettings;
