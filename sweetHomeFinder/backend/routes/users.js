// routes/users.js
const express = require('express');
const router = express.Router();
const sql = require('mssql');
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');

// Middleware to require authentication
//router.use(ClerkExpressRequireAuth());

// @route   POST /api/users/register
// @desc    Register a new user in our database
router.post('/register', async (req, res) => {
  try {
    // Retrieve Clerk User ID from req.body (sent from frontend)
    const clerkUserId = req.body.clerkUserId;  // No need for req.auth

    if (!clerkUserId) {
      return res.status(400).json({ message: 'Clerk User ID is required' });
    }

    const { name, email } = req.body;

    console.log('Registering user with Clerk ID:', clerkUserId); // Debugging

    // Check if user already exists
    const userCheck = await sql.query`
      SELECT adopter_id FROM dbo.Adopters WHERE clerk_user_id = ${clerkUserId}
    `;

    if (userCheck.recordset.length > 0) {
      return res.status(400).json({ message: 'User already registered' });
    }

    // Insert new user into the database
    await sql.query`
      INSERT INTO dbo.Adopters (name, email, clerk_user_id, has_taken_quiz)
      VALUES (${name}, ${email}, ${clerkUserId}, 0)
    `;

    console.log('User registered successfully');
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/users/quiz-status
// @desc    Get user's quiz status
router.get('/quiz-status', async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;
    const result = await sql.query`
      SELECT has_taken_quiz FROM dbo.Adopters
      WHERE clerk_user_id = ${clerkUserId}
    `;
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Quiz status fetched successfully for Clerk ID:', clerkUserId);
    
    res.json({ hasTakenQuiz: result.recordset[0].has_taken_quiz });
  } catch (err) {
    console.error('Error fetching quiz status:', err);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/users/quiz-completed
// @desc    Mark user's quiz as completed
router.post('/quiz-completed', async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;
    await sql.query`
      UPDATE dbo.Adopters
      SET has_taken_quiz = 1
      WHERE clerk_user_id = ${clerkUserId}
    `;

    console.log('Quiz marked as completed for Clerk ID:', clerkUserId);
    res.json({ message: 'Quiz marked as completed' });
  } catch (err) {
    console.error('Error marking quiz as completed:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
