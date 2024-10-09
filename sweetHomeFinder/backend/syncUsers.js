// syncUsers.js
require('dotenv').config();
const axios = require('axios');
const sql = require('mssql');
const connectDB = require('./config/db'); // Import your db config

// Initialize database connection
connectDB();

// Function to fetch all the users in clerk db
const fetchClerkUsers = async () => {
  const apiKey = process.env.CLERK_SECRET_KEY;
  try {
    const response = await axios.get('https://api.clerk.dev/v1/users', {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching users from Clerk:', error);
    return [];
  }
};

const syncUsers = async () => {
  try {
    const db = await connectDB(); // Ensure connection is established here

    const clerkUsers = await fetchClerkUsers();
    const clerkUserIds = new Set(clerkUsers.map(user => user.id));

    const result = await db.request().query('SELECT clerk_user_id FROM dbo.Adopters');
    const azureUserIds = result.recordset.map(user => user.clerk_user_id);

    const usersToDelete = azureUserIds.filter(id => !clerkUserIds.has(id));

    for (const userId of usersToDelete) {
      await db.request().query`
        DELETE FROM dbo.Adopters WHERE clerk_user_id = ${userId}
      `;
      console.log(`Deleted user with Clerk ID: ${userId} from Azure database`);
    }

    console.log('User synchronization complete.');
  } catch (error) {
    console.error('Error during user synchronization:', error);
  }
};

module.exports = syncUsers;