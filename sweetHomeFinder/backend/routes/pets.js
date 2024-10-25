// routes/pets.js
const express = require('express');
const router = express.Router();
const connectDB = require('../config/db');

// Middleware to connect to the database
router.use(async (req, res, next) => {
  try {
    req.db = await connectDB();
    next();
  } catch (err) {
    res.status(500).send('Database connection error');
  }
});

// @route   GET /api/pets
// @desc    Get all available pets
router.get('/', async (req, res) => {
  try {
    const result = await req.db.query('SELECT * FROM "Pets" WHERE is_available = TRUE');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/pets
// @desc    Register a new pet
router.post('/', async (req, res) => {
  const { name, breed, age, description } = req.body;
  try {
    await req.db.query(
      'INSERT INTO "Pets" (name, breed, age, description) VALUES ($1, $2, $3, $4)',
      [name, breed, age, description]
    );
    res.status(201).json({ message: 'Pet registered successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Test endpoint to fetch data from the Pets table
router.get('/test', async (req, res) => {
  try {
    const result = await req.db.query('SELECT * FROM "Pets" LIMIT 1');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching test data:', err);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/pets/matched
// @desc    Get pets matched to user's quiz answers
router.get('/matched', async (req, res) => {
  const { clerkUserId } = req.query;

  if (!clerkUserId) {
    return res.status(400).json({ message: 'Clerk User ID is required' });
  }

  try {
    console.log('Fetching matched pets for Clerk User ID:', clerkUserId);

    // Fetch user's quiz answers
    const quizAnswers = await req.db.query(
      'SELECT question, answer FROM "QuizAnswers" WHERE clerk_user_id = $1',
      [clerkUserId]
    );

    console.log('Quiz answers:', quizAnswers.rows);

    // Process quiz answers and create matching criteria
    const { whereClauses, parameters } = processQuizAnswers(quizAnswers.rows);

    // Construct the SQL query with scoring
    const query = `
      SELECT pet_id, name, breed, age, size, energy_level, living_environment, type, image1,
        (CASE WHEN type = $1 THEN 20 ELSE 0 END +
         CASE WHEN size = $2 THEN 20 ELSE 0 END +
         CASE WHEN energy_level = $3 THEN 20 ELSE 0 END +
         CASE WHEN living_environment = $4 THEN 20 ELSE 0 END) AS match_score
      FROM "Pets"
      WHERE is_available = TRUE
      ORDER BY match_score DESC, pet_id
      LIMIT 5
    `;

    console.log('Generated SQL query:', query);
    console.log('Query parameters:', parameters);

    // Execute the query with parameters
    const matchedPets = await req.db.query(query, [
      parameters.p0, // pet type
      parameters.p1, // size
      parameters.p2, // energy level
      parameters.p3, // living environment
    ]);

    console.log('Matched pets:', matchedPets.rows);

    res.json(matchedPets.rows);
  } catch (err) {
    console.error('Error fetching matched pets:', err);
    res.status(500).json({ message: 'Server error', error: err.message});
  }
});

function processQuizAnswers(answers) {
  let whereClauses = [];
  let parameters = {};

  answers.forEach(({ question, answer }, index) => {
    const paramName = `p${index}`;
    switch (question) {
      case '0': // Pet type
        if (answer !== 'No preference') {
          whereClauses.push(`type = $${index + 1}`);
          parameters[paramName] = answer.toLowerCase();
        }
        break;
      case '1': // Size
        if (answer !== 'No preference') {
          whereClauses.push(`size = $${index + 1}`);
          parameters[paramName] = answer.split(' ')[0].toLowerCase(); // e.g., "large" from "Large (e.g., Golden Retriever, Ragdoll Cat)"
        }
        break;
      case '2': // Energy level
        whereClauses.push(`energy_level = $${index + 1}`);
        parameters[paramName] = mapEnergyLevel(answer);
        break;
      case '3': // Living environment
        if (answer === 'Apartment') {
          whereClauses.push(`living_environment = $${index + 1}`);
          parameters[paramName] = 'apartment_friendly';
        } else {
          whereClauses.push(`living_environment = $${index + 1}`);
          parameters[paramName] = 'house_with_yard';
        }
        break;
    }
  });

  return {whereClauses, parameters};
}

function mapEnergyLevel(answer) {
  switch (answer) {
    case "I'm very active and would like a pet to match":
      return 'high_energy';
    case "I prefer moderate activity, like walks or occasional play":
      return 'moderate_energy';
    case "I'm laid-back and want a calm, low-energy pet":
      return 'low_energy';
    default:
      return 'moderate_energy';
  }
}

function mapAgeRange(answer) {
  switch (answer) {
    case 'Puppy/Kitten':
      return { min: 0, max: 1 };
    case 'Adult':
      return { min: 2, max: 7 };
    case 'Senior':
      return { min: 8, max: 20 };
    default:
      return { min: 0, max: 20 };
  }
}

router.get('/all', async (req, res) => {
  try {
    const result = await req.db.query(
      'SELECT pet_id, name, breed, age, size, energy_level, living_environment, type, image1 FROM "Pets" WHERE is_available = TRUE ORDER BY pet_id'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching all pets:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
