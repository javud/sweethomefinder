// routes/users.js
const express = require('express');
const router = express.Router();
const connectDB = require('../config/db'); // Import your database connection

// Middleware to connect to the database
router.use(async (req, res, next) => {
  try {
    req.db = await connectDB();
    next();
  } catch (err) {
    res.status(500).send('Database connection error');
  }
});

// @route   POST /api/users/register
// @desc    Register a new user in our database
router.post('/register', async (req, res) => {
  try {
    const { clerkUserId, name, email } = req.body;

    if (!clerkUserId) {
      return res.status(400).json({ message: 'Clerk User ID is required' });
    }

    console.log('Registering user with Clerk ID:', clerkUserId);

    const userCheck = await req.db.query(
      'SELECT adopter_id FROM "Adopters" WHERE clerk_user_id = $1',
      [clerkUserId]
    );

    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: 'User already registered' });
    }

    await req.db.query(
      'INSERT INTO "Adopters" (name, email, clerk_user_id, has_taken_quiz) VALUES ($1, $2, $3, $4)',
      [name, email, clerkUserId, false]
    );

    console.log('User registered successfully');
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route   GET /api/users/quiz-status
// @desc    Get user's quiz status
router.get('/quiz-status', async (req, res) => {
  try {
    const clerkUserId = req.query.clerkUserId;
    if (!clerkUserId) {
      return res.status(400).json({ message: 'Clerk User ID is required' });
    }

    const result = await req.db.query(
      'SELECT has_taken_quiz FROM "Adopters" WHERE clerk_user_id = $1',
      [clerkUserId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const hasTakenQuiz = result.rows[0].has_taken_quiz === true;

    console.log('Quiz status for Clerk ID:', clerkUserId, 'is:', hasTakenQuiz);
    
    res.json({ hasTakenQuiz });
  } catch (err) {
    console.error('Error fetching quiz status:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route   POST /api/users/save-quiz-answers
// @desc    Save quiz answers and mark quiz as completed
// @route   POST /api/users/save-quiz-answers
// @desc    Save quiz answers and mark quiz as completed
router.post('/save-quiz-answers', async (req, res) => {
  try {
    const { answers, clerkUserId } = req.body;

    if (!clerkUserId) {
      return res.status(400).json({ message: 'Clerk User ID is required' });
    }

    const userCheck = await req.db.query(
      'SELECT has_taken_quiz FROM "Adopters" WHERE clerk_user_id = $1',
      [clerkUserId]
    );

    if (userCheck.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (userCheck.rows[0].has_taken_quiz === 1) {
      return res.status(400).json({ message: 'User has already taken the quiz' });
    }

    const transaction = await req.db.connect();
    try {
      await transaction.query('BEGIN');

      for (const [question, answer] of Object.entries(answers)) {
        await transaction.query(
          'INSERT INTO "QuizAnswers" (clerk_user_id, question, answer) VALUES ($1, $2, $3)',
          [clerkUserId, question, answer]
        );
      }

      await transaction.query(
        'UPDATE "Adopters" SET has_taken_quiz = TRUE WHERE clerk_user_id = $1',
        [clerkUserId]
      );

      await transaction.query('COMMIT');

      console.log('Quiz answers saved and status updated for Clerk ID:', clerkUserId);
      res.json({ message: 'Quiz answers saved and status updated successfully' });
    } catch (error) {
      await transaction.query('ROLLBACK');
      console.error('Transaction error:', error);
      res.status(500).json({ message: 'Error saving quiz answers', error: error.message });
    } finally {
      transaction.release();
    }
  } catch (err) {
    console.error('Error saving quiz answers:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route   GET /api/users/check-admin
// @desc    Check if user is admin
router.get('/check-admin', async (req, res) => {
  try {
    const { clerkUserId } = req.query;
    
    if (!clerkUserId) {
      return res.status(400).json({ message: 'Clerk User ID is required' });
    }

    const result = await req.db.query(
      'SELECT is_admin FROM "Adopters" WHERE clerk_user_id = $1',
      [clerkUserId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ isAdmin: result.rows[0].is_admin });
  } catch (err) {
    console.error('Error checking admin status:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;

