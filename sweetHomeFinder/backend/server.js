// server.js
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(morgan('dev')); // Logger
app.use(express.json()); // Body parser for JSON

// Connect to the database
connectDB();

// Routes
app.use('/api/pets', require('./routes/pets'));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});