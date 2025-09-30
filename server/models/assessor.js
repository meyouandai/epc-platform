const { query } = require('./database');
const { mockAssessors, mockLeadAssessors, mockPostcodes } = require('./mockData');

// Check if we should use mock data
const USE_MOCK_DATA = process.env.USE_MOCK_DATA === 'true' || !process.env.DATABASE_URL;

// Convert postcode to coordinates (simplified for demo - use real geocoding service in production)
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

// Calculate distance between two coordinates
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Find assessors by postcode
const findAssessorsByPostcode = async (postcode) => {
  try {
    const searchCoords = postcodeToCoordinates(postcode);
    const postcodePrefix = postcode.substring(0, postcode.indexOf(' ') > 0 ? postcode.indexOf(' ') : postcode.length).toUpperCase();

    // Query assessors who cover this postcode area
    const result = await query(`
      SELECT DISTINCT a.*
      FROM assessors a
      LEFT JOIN assessor_postcodes ap ON a.id = ap.assessor_id
      WHERE a.status = 'active'
        AND a.verified = true
        AND (ap.postcode LIKE $1 OR ap.postcode LIKE $2)
        AND ap.status = 'active'
      ORDER BY a.rating DESC, a.review_count DESC
      LIMIT 4
    `, [`${postcodePrefix}%`, `${postcodePrefix.substring(0, postcodePrefix.length - 1)}%`]);

    // Calculate distances and format response
    const assessors = result.rows.map(assessor => {
      const distance = calculateDistance(
        searchCoords.lat, searchCoords.lng,
        assessor.lat || searchCoords.lat,
        assessor.lng || searchCoords.lng
      );

      return {
        id: assessor.id,
        name: assessor.name,
        company: assessor.company,
        rating: parseFloat(assessor.rating),
        reviewCount: assessor.review_count,
        distance: Math.round(distance * 10) / 10,
        price: assessor.price,
        phone: assessor.phone,
        email: assessor.email
      };
    });

    return assessors;
  } catch (error) {
    console.error('Error finding assessors:', error);
    throw error;
  }
};

// Create new assessor
const createAssessor = async (assessorData) => {
  if (USE_MOCK_DATA) {
    // Create new assessor in mock data
    const newAssessor = {
      id: `asm_${Date.now()}`,
      name: assessorData.name,
      company: assessorData.company,
      email: assessorData.email,
      password: assessorData.password,
      phone: assessorData.phone,
      rating: 0,
      review_count: 0,
      price: assessorData.price || '£80',
      verified: false,
      status: 'pending',
      trust_level: 'bronze',
      spending_threshold: 100.00,
      current_period_spend: 0,
      total_successful_payments: 0,
      account_paused: false,
      created_at: new Date(),
      approved_at: null
    };

    // Add to mock data array
    mockAssessors.push(newAssessor);
    return newAssessor;
  }

  try {
    const coordinates = postcodeToCoordinates(assessorData.postcode || 'SW1A 1AA');

    // Tables should already be created by database setup script

    const result = await query(`
      INSERT INTO assessors (
        name, company, email, password, phone, price, lat, lng, status, verified
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [
      assessorData.name,
      assessorData.company,
      assessorData.email,
      assessorData.password,
      assessorData.phone,
      assessorData.price || '£80',
      coordinates.lat,
      coordinates.lng,
      'pending',
      false
    ]);

    return result.rows[0];
  } catch (error) {
    console.error('Error creating assessor:', error);
    throw error;
  }
};

// Update assessor
const updateAssessor = async (id, updates) => {
  try {
    const setClause = Object.keys(updates).map((key, index) => `${key} = $${index + 2}`).join(', ');
    const values = [id, ...Object.values(updates)];

    const result = await query(`
      UPDATE assessors
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `, values);

    return result.rows[0];
  } catch (error) {
    console.error('Error updating assessor:', error);
    throw error;
  }
};

// Find assessor by email
const findAssessorByEmail = async (email) => {
  if (USE_MOCK_DATA) {
    return mockAssessors.find(a => a.email === email) || null;
  }

  try {
    const result = await query('SELECT * FROM assessors WHERE email = $1', [email]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error finding assessor by email:', error);
    throw error;
  }
};

// Find assessor by ID
const findAssessorById = async (id) => {
  if (USE_MOCK_DATA) {
    return mockAssessors.find(a => a.id === id) || null;
  }

  try {
    const result = await query('SELECT * FROM assessors WHERE id = $1', [id]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error finding assessor by ID:', error);
    throw error;
  }
};

// Get all assessors (for admin)
const getAllAssessors = async (filters = {}) => {
  if (USE_MOCK_DATA) {
    // Return mock assessors data
    let assessors = [...mockAssessors];

    // Apply filters if provided
    if (filters.status) {
      assessors = assessors.filter(a => a.status === filters.status);
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      assessors = assessors.filter(a =>
        a.name.toLowerCase().includes(searchTerm) ||
        a.email.toLowerCase().includes(searchTerm) ||
        a.company.toLowerCase().includes(searchTerm)
      );
    }

    return assessors;
  }

  try {
    let whereClause = 'WHERE 1=1';
    const values = [];
    let paramCount = 0;

    if (filters.status) {
      paramCount++;
      whereClause += ` AND status = $${paramCount}`;
      values.push(filters.status);
    }

    if (filters.search) {
      paramCount++;
      whereClause += ` AND (name ILIKE $${paramCount} OR email ILIKE $${paramCount} OR company ILIKE $${paramCount})`;
      values.push(`%${filters.search}%`);
    }

    const result = await query(`
      SELECT *
      FROM assessors
      ${whereClause}
      ORDER BY created_at DESC
    `, values);

    return result.rows;
  } catch (error) {
    console.error('Error getting all assessors:', error);
    throw error;
  }
};

// Get assessor dashboard data
const getAssessorDashboard = async (assessorId) => {
  try {
    // Get basic assessor info
    const assessor = await findAssessorById(assessorId);
    if (!assessor) return null;

    // Get lead counts
    const leadCounts = await query(`
      SELECT
        COUNT(CASE WHEN la.created_at >= CURRENT_DATE THEN 1 END) as today,
        COUNT(CASE WHEN la.created_at >= CURRENT_DATE - INTERVAL '1 day' AND la.created_at < CURRENT_DATE THEN 1 END) as yesterday,
        COUNT(CASE WHEN la.created_at >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as last7Days,
        COUNT(CASE WHEN la.created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as last30Days
      FROM lead_assessors la
      WHERE la.assessor_id = $1
    `, [assessorId]);

    // Get active postcode count
    const postcodes = await query(`
      SELECT COUNT(*) as active_postcodes
      FROM assessor_postcodes
      WHERE assessor_id = $1 AND status = 'active'
    `, [assessorId]);

    // Get average lead price (mock for now)
    const avgPrice = 3.2;

    return {
      totalLeads: leadCounts.rows[0],
      activePostCodes: parseInt(postcodes.rows[0].active_postcodes),
      averageLeadPrice: avgPrice,
      paymentStatus: 'good',
      lastPaymentDate: new Date('2024-12-28'),
      trustLevel: assessor.trust_level || 'bronze',
      canHaveMultipleInvoices: assessor.trust_level === 'gold' || assessor.trust_level === 'platinum'
    };
  } catch (error) {
    console.error('Error getting assessor dashboard:', error);
    throw error;
  }
};

module.exports = {
  findAssessorsByPostcode,
  createAssessor,
  updateAssessor,
  findAssessorByEmail,
  findAssessorById,
  getAllAssessors,
  getAssessorDashboard
};