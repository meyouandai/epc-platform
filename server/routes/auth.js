const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { generateToken } = require('../middleware/auth');
const { createAssessor, findAssessorByEmail, findAssessorById } = require('../models/assessor');

// Register new assessor
router.post('/register', async (req, res) => {
  try {
    const { name, company, email, password, phone, coverageAreas, price } = req.body;

    // Check if assessor already exists
    const existingAssessor = await findAssessorByEmail(email);
    if (existingAssessor) {
      return res.status(400).json({ error: 'Assessor already exists with this email' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create assessor
    const assessor = await createAssessor({
      name,
      company,
      email,
      password: hashedPassword,
      phone,
      coverageAreas: coverageAreas || [],
      price: price || '£80',
      verified: false,
      rating: 0,
      reviewCount: 0
    });

    // Generate token
    const token = generateToken(assessor.id);

    res.status(201).json({
      success: true,
      token,
      assessor: {
        id: assessor.id,
        name: assessor.name,
        company: assessor.company,
        email: assessor.email,
        verified: assessor.verified
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login assessor
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find assessor
    const assessor = await findAssessorByEmail(email);
    if (!assessor) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, assessor.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(assessor.id);

    res.json({
      success: true,
      token,
      assessor: {
        id: assessor.id,
        name: assessor.name,
        company: assessor.company,
        email: assessor.email,
        verified: assessor.verified
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current assessor profile
router.get('/me', require('../middleware/auth').authenticateToken, async (req, res) => {
  try {
    const assessor = await findAssessorById(req.assessorId);
    if (!assessor) {
      return res.status(404).json({ error: 'Assessor not found' });
    }

    // Remove password from response
    const { password, ...assessorData } = assessor;

    res.json({
      success: true,
      assessor: assessorData
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

module.exports = router;