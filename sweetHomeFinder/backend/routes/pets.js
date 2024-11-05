// routes/pets.js
const express = require('express');
const router = express.Router();
const connectDB = require('../config/db');
const cloudinary = require('../config/cloudinary');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// Middleware to connect to the database
router.use(async (req, res, next) => {
  try {
    req.db = await connectDB();
    next();
  } catch (err) {
    res.status(500).send('Database connection error');
  }
});

// @route   DELETE /api/pets/:id
// @desc    Delete a pet
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const checkResult = await req.db.query(
      'SELECT * FROM "Pets" WHERE pet_id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    await req.db.query(
      'DELETE FROM "Pets" WHERE pet_id = $1',
      [id]
    );

    res.json({ message: 'Pet deleted successfully' });
  } catch (err) {
    console.error('Error deleting pet:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
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
      'INSERT INTO "Pets" (name, breed, age, sex, description) VALUES ($1, $2, $3, $4, $5)',
      [name, breed, age, sex, description]
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
      SELECT pet_id, name, breed, age, sex, size, bio, medical_history, energy_level, living_environment, type, image1,
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

// @route   POST /api/pets/list
// @desc    List a new pet
router.post('/list', async (req, res) => {
  try {
    const {
      name,
      breed,
      age,
      sex,
      size,
      bio,
      medical_history,
      is_available,
      energy_level,
      living_environment,
      type,
      image1
    } = req.body;

    // Let the database handle the pet_id auto-increment
    const result = await req.db.query(
      `INSERT INTO "Pets" 
       (name, breed, age, sex, size, bio, medical_history, is_available, energy_level, living_environment, type, image1) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
       RETURNING pet_id`,
      [name, breed, age, sex, size, bio, medical_history, is_available, energy_level, living_environment, type, image1]
    );

    res.status(201).json({ 
      message: 'Pet listed successfully!',
      pet_id: result.rows[0].pet_id 
    });
  } catch (err) {
    console.error('Error listing pet:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


router.post('/upload-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // Convert buffer to base64
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'pet_images',
    });

    res.json({ url: result.secure_url });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Error uploading image' });
  }
});

// @route   GET /api/pets/admin
// @desc    Get all pets (including unavailable ones) for admin
router.get('/admin', async (req, res) => {
  try {
    const result = await req.db.query('SELECT * FROM "Pets" ORDER BY pet_id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching pets for admin:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route   PUT /api/pets/:id
// @desc    Update an existing pet
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      breed,
      age,
      sex,
      size,
      bio,
      type,
      energy_level,
      living_environment,
      medical_history,
      image1,
      is_available
    } = req.body;

    const result = await req.db.query(
      `UPDATE "Pets" 
       SET name = $1, breed = $2, age = $3, sex = $4, size = $5, bio = $6, 
           type = $7, energy_level = $8, living_environment = $9, 
           medical_history = $10, image1 = $11, is_available = $12
       WHERE pet_id = $13
       RETURNING *`,
      [name, breed, age, sex, size, bio, type, energy_level, living_environment, 
       medical_history, image1, is_available, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating pet:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
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
      'SELECT pet_id, name, breed, age, sex, size, bio, medical_history, energy_level, living_environment, type, image1 FROM "Pets" WHERE is_available = TRUE ORDER BY pet_id'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching all pets:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
