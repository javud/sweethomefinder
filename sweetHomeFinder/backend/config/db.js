// config/db.js

require('dotenv').config();
const sql = require('mssql');

// Database connection configuration
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER, // e.g., 'your-server.database.windows.net'
  database: process.env.DB_NAME,
  options: {
    encrypt: true, // Use this if you're connecting to Azure SQL
  },
};

// Connect to Azure SQL database
const connectDB = async () => {
  try {
    await sql.connect(config);
    console.log('Connected to the database!');
  } catch (err) {
    console.error('Database connection failed: ', err);
  }
};

module.exports = connectDB;