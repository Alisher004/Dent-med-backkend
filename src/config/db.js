const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: 'localhost',
    dialect: 'postgres', // PostgreSQL колдонсоң
    logging: false
  }
);

sequelize.authenticate()
  .then(() => console.log('Database connected ✅'))
  .catch(err => console.log('DB connection error:', err));

module.exports = sequelize;