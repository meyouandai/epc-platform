const express = require('express');
const router = express.Router();
const { createLead, getLeadsByAssessor } = require('../models/lead');
const { chargeAssessorForLead } = require('../utils/billing');

// Create a new lead
router.post('/', async (req, res) => {
  try {
    const { assessorId, customerAction, customerData } = req.body;

    if (!assessorId) {
      return res.status(400).json({ error: 'Assessor ID is required' });
    }

    const lead = await createLead({
      assessorId,
      action: customerAction || 'contact_request',
      customerData: customerData || {},
      timestamp: new Date()
    });

    // Charge the assessor for this lead
    try {
      await chargeAssessorForLead(assessorId, lead.id);
    } catch (billingError) {
      console.error('Billing error:', billingError);
      // Continue - lead is created but billing failed
    }

    res.status(201).json({
      success: true,
      lead,
      message: 'Lead created successfully'
    });
  } catch (error) {
    console.error('Error creating lead:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get leads for an assessor (protected route)
router.get('/assessor/:assessorId', require('../middleware/auth').authenticateToken, async (req, res) => {
  try {
    const { assessorId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    // Ensure assessor can only see their own leads
    if (req.assessorId !== assessorId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const leads = await getLeadsByAssessor(assessorId, {
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      leads,
      count: leads.length
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get lead statistics for assessor
router.get('/stats/:assessorId', require('../middleware/auth').authenticateToken, async (req, res) => {
  try {
    const { assessorId } = req.params;

    // Ensure assessor can only see their own stats
    if (req.assessorId !== assessorId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const stats = await require('../models/lead').getLeadStats(assessorId);

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Error fetching lead stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;