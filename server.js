const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
require('dotenv').config();
const sequelize = require('./src/config/db');
const authRoutes = require('./src/routes/auth');

app.use(express.json());
app.use('/auth', authRoutes);

sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
});