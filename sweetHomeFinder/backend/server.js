require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');  // Import the cors middleware
const connectDB = require('./config/db');
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node'); // Use RequireAuth for secure routes

// Clerk configuration
const clerkSecretKey = process.env.CLERK_SECRET_KEY;  // Use the secret key here
console.log('Clerk Secret Key:', clerkSecretKey);  // Add this for debugging

if (!clerkSecretKey) {
  console.error('CLERK_SECRET_KEY is not set in the environment variables');
  process.exit(1);  // Stop the server if the Clerk secret key is not set
}

// Initialize Express app
const app = express();
const PORT = 5001;

// Middleware
app.use(morgan('dev')); // Logger
app.use(express.json()); // Body parser for JSON
app.use(cors());  // Add this line to enable CORS for all origins

// Connect to the database
connectDB();

// Only apply Clerk authentication on routes that need it
app.use('/api/secure-route', ClerkExpressRequireAuth()); // Clerk authentication middleware for secure routes

// Routes (do NOT apply Clerk auth middleware globally)
app.use('/api/pets', require('./routes/pets')); // No Clerk auth here for test
app.use('/api/users', require('./routes/users'));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
