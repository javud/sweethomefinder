// config/db.js

require('dotenv').config();
const { Pool } = require('pg');

// Database connection configuration
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_SERVER, // e.g., '440.database.windows.net'
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false,
  },
};

// Global variable for the database connection
let pool = null;

// Connect to Azure SQL database
const connectDB = async () => {
  if (!pool) { // Only connect if there is no existing connection
    try {
      pool = new Pool(config);
      await pool.connect();
      console.log('Connected to the database!');
    } catch (err) {
      console.error('Database connection failed: ', err);
      throw err;
    }
  }
  return pool; // Return the existing connection if already connected
};

module.exports = connectDB;
