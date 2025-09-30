const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { generateToken, authenticateToken } = require('../middleware/auth');
const { findAdminByEmail, findAdminById, updateAdminMock, getDashboardMetrics, getAreaData } = require('../models/admin');
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

    // When approving (setting to active), also set verified to true
    if (status === 'active') {
      updates.verified = true;
      updates.approved_at = new Date();
    }

    // When rejecting/deactivating, set verified to false
    if (status === 'inactive' || status === 'health_risk') {
      updates.verified = false;
    }

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

// Get admin profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const admin = await findAdminById(req.assessorId);
    if (!admin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    res.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        firstName: admin.first_name || admin.name?.split(' ')[0] || '',
        lastName: admin.last_name || admin.name?.split(' ').slice(1).join(' ') || ''
      }
    });
  } catch (error) {
    console.error('Get admin profile error:', error);
    res.status(500).json({ error: 'Failed to fetch admin profile' });
  }
});

// Update admin profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    console.log('🔍 PUT /profile - Admin ID from token:', req.assessorId);

    const admin = await findAdminById(req.assessorId);
    if (!admin) {
      console.log('❌ Admin not found for ID:', req.assessorId);
      return res.status(403).json({ error: 'Admin access required' });
    }

    console.log('✅ Admin found:', admin);

    const { firstName, lastName, email, password } = req.body;
    console.log('📝 Update request:', { firstName, lastName, email, passwordProvided: !!password });

    // Validation
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ error: 'firstName, lastName, and email are required' });
    }

    // Check if using mock data
    const USE_MOCK_DATA = process.env.USE_MOCK_DATA === 'true' || !process.env.DATABASE_URL;

    if (USE_MOCK_DATA) {
      console.log('📝 Using mock data update');

      // Prepare updates for mock data
      const updates = {
        name: `${firstName} ${lastName}`,
        email: email
      };

      // If password is provided, hash it
      if (password && password.length >= 6) {
        updates.password = await bcrypt.hash(password, 10);
      }

      // Update mock data directly
      const updatedAdmin = updateAdminMock(req.assessorId, updates);

      if (!updatedAdmin) {
        return res.status(404).json({ error: 'Admin not found in mock data' });
      }

      res.json({
        success: true,
        admin: {
          id: updatedAdmin.id,
          email: updatedAdmin.email,
          name: updatedAdmin.name,
          firstName: firstName,
          lastName: lastName
        }
      });
    } else {
      console.log('📝 Using database update');

      const { query } = require('../models/database');

      // Build update query
      let updateQuery = 'UPDATE admins SET ';
      const updateValues = [];
      let valueIndex = 1;

      // Always update name fields
      updateQuery += `name = $${valueIndex++}, `;
      updateValues.push(`${firstName} ${lastName}`);

      updateQuery += `email = $${valueIndex++}`;
      updateValues.push(email);

      // If password is provided, hash and update it
      if (password && password.length >= 6) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updateQuery += `, password = $${valueIndex++}`;
        updateValues.push(hashedPassword);
      }

      updateQuery += ` WHERE id = $${valueIndex} RETURNING id, name, email`;
      updateValues.push(req.assessorId);

      console.log('🔍 Update query:', updateQuery);
      console.log('🔍 Update values:', updateValues);

      const result = await query(updateQuery, updateValues);
      console.log('🔍 Update result:', result.rows);

      if (result.rows.length === 0) {
        console.log('❌ No rows updated for admin ID:', req.assessorId);
        return res.status(404).json({ error: 'Admin not found' });
      }

      const updatedAdmin = result.rows[0];

      res.json({
        success: true,
        admin: {
          id: updatedAdmin.id,
          email: updatedAdmin.email,
          name: updatedAdmin.name,
          firstName: firstName,
          lastName: lastName
        }
      });
    }
  } catch (error) {
    console.error('Update admin profile error:', error);
    res.status(500).json({ error: 'Failed to update admin profile' });
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