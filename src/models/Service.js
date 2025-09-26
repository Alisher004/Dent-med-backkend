const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Service = sequelize.define('Service', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  price: { type: DataTypes.DECIMAL(10,2), allowNull: false },
  duration: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 30 },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
});

module.exports = Service;
