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


module.exports = router;