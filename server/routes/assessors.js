const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  findAssessorById,
  getAssessorDashboard,
  updateAssessor,
  findAssessorsByPostcode
} = require('../models/assessor');
const { getLeadsForAssessor } = require('../models/lead');
const { query } = require('../models/database');

// Get assessors by postcode (public endpoint)
router.get('/search', async (req, res) => {
  try {
    const { postcode } = req.query;

    if (!postcode) {
      return res.status(400).json({ error: 'Postcode is required' });
    }

    const assessors = await findAssessorsByPostcode(postcode);

    res.json({
      success: true,
      assessors,
      count: assessors.length
    });
  } catch (error) {
    console.error('Error searching assessors:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get assessor dashboard data
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const dashboardData = await getAssessorDashboard(req.assessorId);

    if (!dashboardData) {
      return res.status(404).json({ error: 'Assessor not found' });
    }

    res.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Get assessor leads
router.get('/leads', authenticateToken, async (req, res) => {
  try {
    const { dateFilter, search, page = 1, limit = 20 } = req.query;

    const filters = {};
    if (dateFilter) filters.dateFilter = dateFilter;
    if (search) filters.search = search;

    const leads = await getLeadsForAssessor(req.assessorId, filters);

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

// Get assessor postcodes
router.get('/postcodes', authenticateToken, async (req, res) => {
  try {
    const result = await query(`
      SELECT
        postcode,
        status,
        price,
        added_at
      FROM assessor_postcodes
      WHERE assessor_id = $1
      ORDER BY postcode
    `, [req.assessorId]);

    // Group by region for frontend
    const postcodesByRegion = {};

    result.rows.forEach(row => {
      const region = getRegionFromPostcode(row.postcode);
      const city = getCityFromPostcode(row.postcode);

      if (!postcodesByRegion[region]) {
        postcodesByRegion[region] = {};
      }

      if (!postcodesByRegion[region][city]) {
        postcodesByRegion[region][city] = [];
      }

      postcodesByRegion[region][city].push({
        code: row.postcode,
        price: parseFloat(row.price),
        status: row.status,
        addedAt: row.added_at
      });
    });

    res.json({
      success: true,
      postcodes: postcodesByRegion
    });
  } catch (error) {
    console.error('Get postcodes error:', error);
    res.status(500).json({ error: 'Failed to fetch postcodes' });
  }
});

// Update postcode status
router.patch('/postcodes/:postcode/status', authenticateToken, async (req, res) => {
  try {
    const { postcode } = req.params;
    const { status } = req.body; // active, paused, inactive

    if (!['active', 'paused', 'inactive'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const result = await query(`
      UPDATE assessor_postcodes
      SET status = $1
      WHERE assessor_id = $2 AND postcode = $3
      RETURNING *
    `, [status, req.assessorId, postcode]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Postcode not found' });
    }

    res.json({
      success: true,
      postcode: result.rows[0]
    });
  } catch (error) {
    console.error('Update postcode status error:', error);
    res.status(500).json({ error: 'Failed to update postcode status' });
  }
});

// Add new postcode
router.post('/postcodes', authenticateToken, async (req, res) => {
  try {
    const { postcode, price } = req.body;

    if (!postcode || !price) {
      return res.status(400).json({ error: 'Postcode and price are required' });
    }

    const result = await query(`
      INSERT INTO assessor_postcodes (assessor_id, postcode, price, status)
      VALUES ($1, $2, $3, 'active')
      ON CONFLICT (assessor_id, postcode)
      DO UPDATE SET price = $3, status = 'active'
      RETURNING *
    `, [req.assessorId, postcode.toUpperCase(), parseFloat(price)]);

    res.json({
      success: true,
      postcode: result.rows[0]
    });
  } catch (error) {
    console.error('Add postcode error:', error);
    res.status(500).json({ error: 'Failed to add postcode' });
  }
});

// Get billing information
router.get('/billing', authenticateToken, async (req, res) => {
  try {
    const assessor = await findAssessorById(req.assessorId);
    if (!assessor) {
      return res.status(404).json({ error: 'Assessor not found' });
    }

    // Get billing documents
    const billingResult = await query(`
      SELECT
        document_number,
        type,
        amount,
        status,
        period_start,
        period_end,
        created_at,
        payment_date,
        lead_count,
        reason
      FROM billing_documents
      WHERE assessor_id = $1
      ORDER BY created_at DESC
      LIMIT 50
    `, [req.assessorId]);

    const billingData = {
      trustLevel: assessor.trust_level || 'bronze',
      currentSpend: parseFloat(assessor.current_period_spend) || 0,
      threshold: parseFloat(assessor.spending_threshold) || 250,
      accountPaused: assessor.account_paused || false,
      totalSuccessfulPayments: assessor.total_successful_payments || 0,
      documents: billingResult.rows.map(doc => ({
        id: doc.document_number,
        type: doc.type,
        amount: parseFloat(doc.amount),
        status: doc.status,
        periodStart: doc.period_start,
        periodEnd: doc.period_end,
        createdAt: doc.created_at,
        paymentDate: doc.payment_date,
        leadCount: doc.lead_count,
        reason: doc.reason
      }))
    };

    res.json({
      success: true,
      billing: billingData
    });
  } catch (error) {
    console.error('Get billing error:', error);
    res.status(500).json({ error: 'Failed to fetch billing information' });
  }
});

// Update account settings
router.patch('/settings', authenticateToken, async (req, res) => {
  try {
    const updates = {};
    const allowedFields = ['name', 'company', 'phone', 'price'];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    const updatedAssessor = await updateAssessor(req.assessorId, updates);

    if (!updatedAssessor) {
      return res.status(404).json({ error: 'Assessor not found' });
    }

    res.json({
      success: true,
      assessor: {
        id: updatedAssessor.id,
        name: updatedAssessor.name,
        company: updatedAssessor.company,
        phone: updatedAssessor.phone,
        price: updatedAssessor.price
      }
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// Toggle account pause
router.post('/pause', authenticateToken, async (req, res) => {
  try {
    const assessor = await findAssessorById(req.assessorId);
    if (!assessor) {
      return res.status(404).json({ error: 'Assessor not found' });
    }

    const newPauseStatus = !assessor.account_paused;

    const updatedAssessor = await updateAssessor(req.assessorId, {
      account_paused: newPauseStatus
    });

    res.json({
      success: true,
      paused: updatedAssessor.account_paused,
      message: newPauseStatus ? 'Account paused' : 'Account resumed'
    });
  } catch (error) {
    console.error('Toggle pause error:', error);
    res.status(500).json({ error: 'Failed to toggle account pause' });
  }
});

// Helper functions
const getRegionFromPostcode = (postcode) => {
  const prefix = postcode.substring(0, 2).toUpperCase();
  const regionMap = {
    'SW': 'Greater London',
    'W1': 'Greater London',
    'WC': 'Greater London',
    'EC': 'Greater London',
    'E1': 'Greater London',
    'N1': 'Greater London',
    'NW': 'Greater London',
    'SE': 'Greater London',
    'B1': 'West Midlands',
    'B2': 'West Midlands',
    'CV': 'West Midlands',
    'WV': 'West Midlands',
    'M1': 'North West',
    'M2': 'North West',
    'L1': 'North West',
    'LS': 'Yorkshire',
    'S1': 'Yorkshire',
    'YO': 'Yorkshire'
  };
  return regionMap[prefix] || 'Other';
};

const getCityFromPostcode = (postcode) => {
  const prefix = postcode.substring(0, 2).toUpperCase();
  const cityMap = {
    'SW': 'Central London',
    'W1': 'West End',
    'WC': 'West Central London',
    'EC': 'East Central London',
    'E1': 'East London',
    'N1': 'North London',
    'NW': 'North West London',
    'SE': 'South East London',
    'B1': 'Birmingham',
    'B2': 'Birmingham',
    'CV': 'Coventry',
    'WV': 'Wolverhampton',
    'M1': 'Manchester',
    'M2': 'Manchester',
    'L1': 'Liverpool',
    'LS': 'Leeds',
    'S1': 'Sheffield',
    'YO': 'York'
  };
  return cityMap[prefix] || 'Other';
};

module.exports = router;