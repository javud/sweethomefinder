// routes/pets.js
const express = require('express');
const router = express.Router();
const sql = require('mssql');

// @route   GET /api/pets
// @desc    Get all available pets
router.get('/', async (req, res) => {
  try {
    const result = await sql.query`SELECT * FROM Pets`;
    res.json(result.recordset);
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
    const result = await sql.query`
      INSERT INTO Pets (name, breed, age, description)
      VALUES (${name}, ${breed}, ${age}, ${description})
    `;
    res.status(201).json({ message: 'Pet registered successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Test endpoint to fetch data from the Pets table
router.get('/test', async (req, res) => {
  try {
    const result = await sql.query`SELECT TOP 1 * FROM Pets`;
    res.json(result.recordset);
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
    const quizAnswers = await sql.query`
      SELECT question, answer
      FROM dbo.QuizAnswers
      WHERE clerk_user_id = ${clerkUserId}
    `;

    console.log('Quiz answers:', quizAnswers.recordset);

    // Process quiz answers and create matching criteria
    const { whereClauses, parameters } = processQuizAnswers(quizAnswers.recordset);

    // Construct the SQL query with scoring
    const query = `
      SELECT TOP 5 pet_id, name, breed, age, size, energy_level, living_environment, type, image1,
        (CASE WHEN type = @p0 THEN 20 ELSE 0 END +
         CASE WHEN size = @p1 THEN 20 ELSE 0 END +
         CASE WHEN energy_level = @p2 THEN 20 ELSE 0 END +
         CASE WHEN living_environment = @p3 THEN 20 ELSE 0 END) AS match_score
      FROM dbo.Pets
      WHERE is_available = 1
      ORDER BY match_score DESC, pet_id
    `;

    console.log('Generated SQL query:', query);
    console.log('Query parameters:', parameters);

    // Create a new SQL request
    const request = new sql.Request();

    // Add parameters to the request
    Object.entries(parameters).forEach(([key, value]) => {
      request.input(key, value);
    });

    // Execute the query with parameters
    const matchedPets = await request.query(query);

    console.log('Matched pets:', matchedPets.recordset);

    res.json(matchedPets.recordset);
  } catch (err) {
    console.error('Error fetching matched pets:', err);
    res.status(500).json({ message: 'Server error', error: err.message, stack: err.stack });
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
          whereClauses.push(`type = @${paramName}`);
          parameters[paramName] = answer.toLowerCase();
        }
        break;
      case '1': // Size
        if (answer !== 'No preference') {
          whereClauses.push(`size = @${paramName}`);
          parameters[paramName] = answer.split(' ')[0].toLowerCase(); // e.g., "large" from "Large (e.g., Golden Retriever, Ragdoll Cat)"
        }
        break;
      case '2': // Energy level
        whereClauses.push(`energy_level = @${paramName}`);
        parameters[paramName] = mapEnergyLevel(answer);
        break;
      case '3': // Living environment
        if (answer === 'Apartment') {
          whereClauses.push(`living_environment = @${paramName}`);
          parameters[paramName] = 'apartment_friendly';
        } else {
          whereClauses.push(`living_environment = @${paramName}`);
          parameters[paramName] = 'house_with_yard';
        }
        break;
    }
  });

  whereClauses.push('is_available = @isAvailable');
  parameters.isAvailable = 1;

  return { 
    whereClauses,
    parameters
  };
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

module.exports = router;

module.exports = router;