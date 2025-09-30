const express = require('express');
const router = express.Router();
const { query } = require('../models/database');

// Get count of names
router.get('/count', async (req, res) => {
  try {
    console.log('GET /count - Fetching count of names');

    const result = await query('SELECT COUNT(*) as count FROM simple_names');
    const count = parseInt(result.rows[0].count) || 0;

    console.log('Count result:', count);

    res.json({
      success: true,
      count: count
    });
  } catch (error) {
    console.error('Error getting count:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get count',
      details: error.message
    });
  }
});

// Add a name
router.post('/add', async (req, res) => {
  try {
    const { name } = req.body;

    console.log('POST /add - Adding name:', name);

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Name is required'
      });
    }

    // Create table if it doesn't exist
    await query(`
      CREATE TABLE IF NOT EXISTS simple_names (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert the name
    const result = await query(
      'INSERT INTO simple_names (name) VALUES ($1) RETURNING *',
      [name.trim()]
    );

    console.log('Insert result:', result.rows[0]);

    res.json({
      success: true,
      message: 'Name added successfully',
      name: result.rows[0]
    });
  } catch (error) {
    console.error('Error adding name:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add name',
      details: error.message
    });
  }
});

module.exports = router;