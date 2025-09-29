const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { generateToken, authenticateToken } = require('../middleware/auth');
const { findAdminByEmail, findAdminById, getDashboardMetrics, getAreaData } = require('../models/admin');
const { getAllAssessors } = require('../models/assessor');
const { getAllLeads } = require('../models/lead');

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await findAdminByEmail(email);
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token with admin ID
    const token = generateToken(admin.id);

    res.json({
      success: true,
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get admin dashboard metrics
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    // Verify admin access
    const admin = await findAdminById(req.assessorId);
    if (!admin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { period = '30days', startDate, endDate } = req.query;
    const metrics = await getDashboardMetrics(period, startDate, endDate);

    res.json({
      success: true,
      metrics
    });
  } catch (error) {
    console.error('Dashboard metrics error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard metrics' });
  }
});

// Get all assessors
router.get('/assessors', authenticateToken, async (req, res) => {
  try {
    // Verify admin access
    const admin = await findAdminById(req.assessorId);
    if (!admin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { status, search } = req.query;
    const filters = {};
    if (status) filters.status = status;
    if (search) filters.search = search;

    const assessors = await getAllAssessors(filters);

    res.json({
      success: true,
      assessors
    });
  } catch (error) {
    console.error('Get assessors error:', error);
    res.status(500).json({ error: 'Failed to fetch assessors' });
  }
});

// Get all leads
router.get('/leads', authenticateToken, async (req, res) => {
  try {
    // Verify admin access
    const admin = await findAdminById(req.assessorId);
    if (!admin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { status, search, page = 1, limit = 50 } = req.query;
    const filters = {};
    if (status) filters.status = status;
    if (search) filters.search = search;

    const leads = await getAllLeads(filters);

    // Simple pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedLeads = leads.slice(startIndex, endIndex);

    res.json({
      success: true,
      leads: paginatedLeads,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(leads.length / limit),
        totalLeads: leads.length,
        hasNext: endIndex < leads.length,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

// Get coverage areas
router.get('/coverage', authenticateToken, async (req, res) => {
  try {
    // Verify admin access
    const admin = await findAdminById(req.assessorId);
    if (!admin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const areas = await getAreaData();

    res.json({
      success: true,
      areas
    });
  } catch (error) {
    console.error('Get coverage error:', error);
    res.status(500).json({ error: 'Failed to fetch coverage data' });
  }
});

// Update assessor status
router.patch('/assessors/:id/status', authenticateToken, async (req, res) => {
  try {
    // Verify admin access
    const admin = await findAdminById(req.assessorId);
    if (!admin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { id } = req.params;
    const { status, reason } = req.body;

    const { updateAssessor } = require('../models/assessor');
    const updates = { status };

    if (status === 'health_risk' && reason) {
      updates.health_risk_reasons = [reason];
    }

    const updatedAssessor = await updateAssessor(id, updates);

    if (!updatedAssessor) {
      return res.status(404).json({ error: 'Assessor not found' });
    }

    res.json({
      success: true,
      assessor: updatedAssessor
    });
  } catch (error) {
    console.error('Update assessor status error:', error);
    res.status(500).json({ error: 'Failed to update assessor status' });
  }
});

// Admin search endpoint
router.get('/search', authenticateToken, async (req, res) => {
  try {
    // Verify admin access
    const admin = await findAdminById(req.assessorId);
    if (!admin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { q: query, type = 'all' } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Search query required' });
    }

    const results = {};

    if (type === 'all' || type === 'assessors') {
      const assessors = await getAllAssessors({ search: query });
      results.assessors = assessors.slice(0, 10); // Limit results
    }

    if (type === 'all' || type === 'leads') {
      const leads = await getAllLeads({ search: query });
      results.leads = leads.slice(0, 10); // Limit results
    }

    res.json({
      success: true,
      query,
      results
    });
  } catch (error) {
    console.error('Admin search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

module.exports = router;