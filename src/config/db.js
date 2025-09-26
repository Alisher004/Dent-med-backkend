const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;
if (process.env.DB_DIALECT === 'sqlite') {
  sequelize = new Sequelize({ dialect: 'sqlite', storage: './database.sqlite', logging: false });
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    String(process.env.DB_PASS || ''),
    {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || 5432),
      dialect: 'postgres',
      logging: false
    }
  );
}

sequelize.authenticate()
  .then(() => console.log('Database connected ✅'))
  .catch(err => console.log('DB connection error:', err));

module.exports = sequelize;