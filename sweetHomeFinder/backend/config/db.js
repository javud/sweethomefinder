// config/db.js

require('dotenv').config();
const sql = require('mssql');

// Database connection configuration
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER, // e.g., '440.database.windows.net'
  database: process.env.DB_NAME,
  options: {
    encrypt: true, // Use encryption for Azure SQL
    trustServerCertificate: false, // Set this explicitly for Azure SQL
    enableArithAbort: true, // This is required by Azure SQL
    connectTimeout: 30000, // Increase the timeout to 30 seconds
  },
};

// Global variable for the database connection
let pool = null;

// Connect to Azure SQL database
const connectDB = async () => {
  if (!pool) { // Only connect if there is no existing connection
    try {
      pool = await sql.connect(config);
      console.log('Connected to the database!');
    } catch (err) {
      console.error('Database connection failed: ', err);
      throw err;
    }
  }
  return pool; // Return the existing connection if already connected
};

module.exports = connectDB;
