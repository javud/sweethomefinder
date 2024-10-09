// server.js
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cron = require('node-cron');
const syncUsers = require('./syncUsers');
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');

const app = express();
const PORT = 5001;

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

syncUsers().then(() => {
  console.log('Initial user synchronization complete.');
});

cron.schedule('*/10 * * * *', () => {
  console.log('Running scheduled user synchronization...');
  syncUsers();
});

// Clerk authentication for secure routes
app.use('/api/secure-route', ClerkExpressRequireAuth());

// Public routes
app.use('/api/pets', require('./routes/pets'));
app.use('/api/users', require('./routes/users'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});