const { query } = require('./database');

// Check if we should use mock data
const USE_MOCK_DATA = process.env.USE_MOCK_DATA === 'true' || !process.env.DATABASE_URL;

// Create new lead
const createLead = async (leadData) => {
  try {
    const coordinates = postcodeToCoordinates(leadData.postcode);

    const result = await query(`
      INSERT INTO leads (
        customer_name, email, phone, address, postcode, property_type,
        bedrooms, timeframe, additional_info, price, coordinates
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, ST_MakePoint($11, $12))
      RETURNING *
    `, [
      leadData.customerName,
      leadData.email,
      leadData.phone,
      leadData.address,
      leadData.postcode,
      leadData.propertyType,
      leadData.bedrooms,
      leadData.timeframe,
      leadData.additionalInfo,
      leadData.price,
      coordinates.lng,
      coordinates.lat
    ]);

    return result.rows[0];
  } catch (error) {
    console.error('Error creating lead:', error);
    throw error;
  }
};

// Get leads for assessor
const getLeadsForAssessor = async (assessorId, filters = {}) => {
  try {
    let whereClause = 'WHERE la.assessor_id = $1';
    const values = [assessorId];
    let paramCount = 1;

    if (filters.dateFilter && filters.dateFilter !== 'all') {
      paramCount++;
      switch (filters.dateFilter) {
        case 'today':
          whereClause += ` AND l.created_at >= CURRENT_DATE`;
          break;
        case 'last7':
          whereClause += ` AND l.created_at >= CURRENT_DATE - INTERVAL '7 days'`;
          break;
        case 'last30':
          whereClause += ` AND l.created_at >= CURRENT_DATE - INTERVAL '30 days'`;
          break;
      }
    }

    if (filters.search) {
      paramCount++;
      whereClause += ` AND (l.postcode ILIKE $${paramCount} OR l.customer_name ILIKE $${paramCount} OR l.email ILIKE $${paramCount})`;
      values.push(`%${filters.search}%`);
    }

    const result = await query(`
      SELECT l.*, la.assigned_at, la.status as assignment_status
      FROM leads l
      JOIN lead_assessors la ON l.id = la.lead_id
      ${whereClause}
      ORDER BY l.created_at DESC
    `, values);

    return result.rows.map(lead => ({
      id: lead.id,
      postcode: lead.postcode,
      customerName: lead.customer_name,
      price: parseFloat(lead.price),
      date: lead.created_at,
      address: lead.address,
      phone: lead.phone,
      email: lead.email,
      propertyType: lead.property_type,
      bedrooms: lead.bedrooms,
      timeframe: lead.timeframe,
      additionalInfo: lead.additional_info
    }));
  } catch (error) {
    console.error('Error getting leads for assessor:', error);
    throw error;
  }
};

// Get all leads (for admin)
const getAllLeads = async (filters = {}) => {
  if (USE_MOCK_DATA) {
    // Return empty array for demo - no real leads exist
    return [];
  }

  try {
    let whereClause = 'WHERE 1=1';
    const values = [];
    let paramCount = 0;

    if (filters.status) {
      paramCount++;
      whereClause += ` AND l.status = $${paramCount}`;
      values.push(filters.status);
    }

    if (filters.search) {
      paramCount++;
      whereClause += ` AND (l.postcode ILIKE $${paramCount} OR l.customer_name ILIKE $${paramCount})`;
      values.push(`%${filters.search}%`);
    }

    const result = await query(`
      SELECT l.*,
        ARRAY_AGG(
          JSON_BUILD_OBJECT(
            'id', a.id,
            'name', a.name,
            'company', a.company,
            'email', a.email,
            'status', la.status
          )
        ) FILTER (WHERE a.id IS NOT NULL) as assessors
      FROM leads l
      LEFT JOIN lead_assessors la ON l.id = la.lead_id
      LEFT JOIN assessors a ON la.assessor_id = a.id
      ${whereClause}
      GROUP BY l.id
      ORDER BY l.created_at DESC
    `, values);

    return result.rows.map(lead => ({
      id: lead.id,
      customerName: lead.customer_name,
      email: lead.email,
      phone: lead.phone,
      address: lead.address,
      postcode: lead.postcode,
      propertyType: lead.property_type,
      bedrooms: lead.bedrooms,
      timeframe: lead.timeframe,
      additionalInfo: lead.additional_info,
      status: lead.status,
      price: parseFloat(lead.price),
      createdAt: lead.created_at,
      assessors: lead.assessors || []
    }));
  } catch (error) {
    console.error('Error getting all leads:', error);
    throw error;
  }
};

// Assign lead to assessors
const assignLeadToAssessors = async (leadId, assessorIds) => {
  try {
    // First, remove existing assignments
    await query('DELETE FROM lead_assessors WHERE lead_id = $1', [leadId]);

    // Then add new assignments
    for (const assessorId of assessorIds) {
      await query(`
        INSERT INTO lead_assessors (lead_id, assessor_id)
        VALUES ($1, $2)
        ON CONFLICT (lead_id, assessor_id) DO NOTHING
      `, [leadId, assessorId]);
    }

    return true;
  } catch (error) {
    console.error('Error assigning lead to assessors:', error);
    throw error;
  }
};

// Get lead statistics
const getLeadStats = async () => {
  try {
    const result = await query(`
      SELECT
        COUNT(*) as total_leads,
        COUNT(CASE WHEN status = 'new' THEN 1 END) as new_leads,
        COUNT(CASE WHEN status = 'contacted' THEN 1 END) as contacted_leads,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_leads,
        AVG(price) as average_price
      FROM leads
      WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
    `);

    return {
      totalLeads: parseInt(result.rows[0].total_leads) || 0,
      newLeads: parseInt(result.rows[0].new_leads) || 0,
      contactedLeads: parseInt(result.rows[0].contacted_leads) || 0,
      completedLeads: parseInt(result.rows[0].completed_leads) || 0,
      averagePrice: parseFloat(result.rows[0].average_price) || 0
    };
  } catch (error) {
    console.error('Error getting lead stats:', error);
    throw error;
  }
};

// Update lead status
const updateLeadStatus = async (leadId, status) => {
  try {
    const result = await query(`
      UPDATE leads
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `, [status, leadId]);

    return result.rows[0];
  } catch (error) {
    console.error('Error updating lead status:', error);
    throw error;
  }
};

// Helper function - same as in assessor model
const postcodeToCoordinates = (postcode) => {
  const postcodeMappings = {
    'SW1A': { lat: 51.5014, lng: -0.1419 },
    'SW1P': { lat: 51.5012, lng: -0.1405 },
    'SW1V': { lat: 51.5009, lng: -0.1399 },
    'SW1W': { lat: 51.5018, lng: -0.1423 },
    'SW1X': { lat: 51.5015, lng: -0.1410 },
    'SW1Y': { lat: 51.5011, lng: -0.1415 },
    'W1K': { lat: 51.5155, lng: -0.1426 },
    'W1J': { lat: 51.5094, lng: -0.1458 },
    'B1': { lat: 52.4862, lng: -1.8904 },
    'B2': { lat: 52.4800, lng: -1.8900 },
    'B3': { lat: 52.4750, lng: -1.8850 },
    'CV1': { lat: 52.4068, lng: -1.5197 },
    'CV2': { lat: 52.4200, lng: -1.5300 },
    'M1': { lat: 53.4808, lng: -2.2426 },
    'M2': { lat: 53.4900, lng: -2.2500 },
    'LS1': { lat: 53.8008, lng: -1.5491 },
    'LS2': { lat: 53.8100, lng: -1.5600 }
  };

  const prefix = postcode.substring(0, postcode.indexOf(' ') > 0 ? postcode.indexOf(' ') : postcode.length).toUpperCase();
  const shortPrefix = prefix.length > 3 ? prefix.substring(0, prefix.length - 1) : prefix;

  return postcodeMappings[prefix] || postcodeMappings[shortPrefix] || { lat: 51.5074, lng: -0.1278 };
};

module.exports = {
  createLead,
  getLeadsForAssessor,
  getAllLeads,
  assignLeadToAssessors,
  getLeadStats,
  updateLeadStatus
};