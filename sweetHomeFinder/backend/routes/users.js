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
    const clerkUserId = req.body.clerkUserId;

    if (!clerkUserId) {
      return res.status(400).json({ message: 'Clerk User ID is required' });
    }

    const { name, email } = req.body;

    console.log('Registering user with Clerk ID:', clerkUserId);

    const userCheck = await sql.query`
      SELECT adopter_id FROM dbo.Adopters WHERE clerk_user_id = ${clerkUserId}
    `;

    if (userCheck.recordset.length > 0) {
      return res.status(400).json({ message: 'User already registered' });
    }

    await sql.query`
      INSERT INTO dbo.Adopters (name, email, clerk_user_id, has_taken_quiz)
      VALUES (${name}, ${email}, ${clerkUserId}, 0)
    `;

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

    const result = await sql.query`
      SELECT has_taken_quiz FROM dbo.Adopters
      WHERE clerk_user_id = ${clerkUserId}
    `;
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const hasTakenQuiz = result.recordset[0].has_taken_quiz;
    console.log('Quiz status for Clerk ID:', clerkUserId, 'is:', hasTakenQuiz);
    
    res.json({ hasTakenQuiz: hasTakenQuiz });
  } catch (err) {
    console.error('Error fetching quiz status:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route   POST /api/users/save-quiz-answers
// @desc    Save quiz answers and mark quiz as completed
router.post('/save-quiz-answers', async (req, res) => {
  try {
    const { answers, clerkUserId } = req.body;

    if (!clerkUserId) {
      return res.status(400).json({ message: 'Clerk User ID is required' });
    }

    const userCheck = await sql.query`
      SELECT has_taken_quiz FROM dbo.Adopters WHERE clerk_user_id = ${clerkUserId}
    `;

    if (userCheck.recordset.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (userCheck.recordset[0].has_taken_quiz === 1) {
      return res.status(400).json({ message: 'User has already taken the quiz' });
    }

    const transaction = new sql.Transaction();
    await transaction.begin();

    try {
      for (const [question, answer] of Object.entries(answers)) {
        await transaction.request().query`
          INSERT INTO dbo.QuizAnswers (clerk_user_id, question, answer)
          VALUES (${clerkUserId}, ${question}, ${answer})
        `;
      }

      await transaction.request().query`
        UPDATE dbo.Adopters
        SET has_taken_quiz = 1
        WHERE clerk_user_id = ${clerkUserId}
      `;

      await transaction.commit();

      console.log('Quiz answers saved and status updated for Clerk ID:', clerkUserId);
      res.json({ message: 'Quiz answers saved and status updated successfully' });
    } catch (error) {
      await transaction.rollback();
      console.error('Transaction error:', error);
      res.status(500).json({ message: 'Error saving quiz answers', error: error.message });
    }
  } catch (err) {
    console.error('Error saving quiz answers:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;