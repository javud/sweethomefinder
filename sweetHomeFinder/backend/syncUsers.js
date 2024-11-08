require('dotenv').config();
const axios = require('axios');
const connectDB = require('./config/db'); // Import your db config

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
  /*
  try {
    const pool = await connectDB(); // Ensure a connection is established here
    const clerkUsers = await fetchClerkUsers();
    const clerkUserIds = new Set(clerkUsers.map(user => user.id));

    // Fetch all users from Supabase/PostgreSQL
    const result = await pool.query('SELECT clerk_user_id FROM "Adopters"');
    const azureUserIds = result.rows.map(user => user.clerk_user_id);

    // Identify users to delete
    const usersToDelete = azureUserIds.filter(id => !clerkUserIds.has(id));

    // Delete users not present in Clerk
    for (const userId of usersToDelete) {
      await pool.query('DELETE FROM "Adopters" WHERE clerk_user_id = $1', [userId]);
      console.log(`Deleted user with Clerk ID: ${userId} from Postgres database`);
    }

    console.log('User synchronization complete.');
  } catch (error) {
    console.error('Error during user synchronization:', error);
  } */
};

module.exports = syncUsers;
