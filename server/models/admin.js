const { query } = require('./database');
const { mockAdmins } = require('./mockData');

// Check if we should use mock data
const USE_MOCK_DATA = process.env.USE_MOCK_DATA === 'true' || !process.env.DATABASE_URL;

// Find admin by email
const findAdminByEmail = async (email) => {
  if (USE_MOCK_DATA) {
    return mockAdmins.find(admin => admin.email === email) || null;
  }

  try {
    const result = await query('SELECT * FROM admins WHERE email = $1', [email]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error finding admin by email:', error);
    throw error;
  }
};

// Find admin by ID
const findAdminById = async (id) => {
  try {
    const result = await query('SELECT * FROM admins WHERE id = $1', [id]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error finding admin by ID:', error);
    throw error;
  }
};

// Get dashboard metrics
const getDashboardMetrics = async (period = '30days', startDate = null, endDate = null) => {
  try {
    let dateFilter = '';
    let dateValues = [];

    switch (period) {
      case 'today':
        dateFilter = 'AND created_at >= CURRENT_DATE';
        break;
      case '7days':
        dateFilter = 'AND created_at >= CURRENT_DATE - INTERVAL \'7 days\'';
        break;
      case '30days':
        dateFilter = 'AND created_at >= CURRENT_DATE - INTERVAL \'30 days\'';
        break;
      case 'custom':
        if (startDate && endDate) {
          dateFilter = 'AND created_at >= $1 AND created_at <= $2';
          dateValues = [startDate, endDate];
        }
        break;
    }

    // Get total leads
    const totalLeadsResult = await query(`
      SELECT COUNT(*) as count FROM leads WHERE 1=1 ${dateFilter}
    `, dateValues);

    // Get total revenue (mock calculation based on leads)
    const revenueResult = await query(`
      SELECT SUM(price * 0.1) as revenue FROM leads WHERE 1=1 ${dateFilter}
    `, dateValues);

    // Get overdue payments (mock for now)
    const overdueResult = await query(`
      SELECT COUNT(*) as count FROM billing_documents
      WHERE status = 'pending' AND created_at < CURRENT_DATE - INTERVAL '30 days'
    `);

    // Get new assessors
    const newAssessorsResult = await query(`
      SELECT COUNT(*) as count FROM assessors WHERE 1=1 ${dateFilter}
    `, dateValues);

    // Get active assessors
    const activeAssessorsResult = await query(`
      SELECT COUNT(*) as count FROM assessors WHERE status = 'active'
    `);

    // Get total districts (mock calculation)
    const districtsResult = await query(`
      SELECT COUNT(DISTINCT LEFT(postcode, 2)) as count FROM assessor_postcodes
    `);

    return {
      totalLeads: parseInt(totalLeadsResult.rows[0].count) || 0,
      totalRevenue: parseFloat(revenueResult.rows[0].revenue) || 0,
      totalOverdue: parseInt(overdueResult.rows[0].count) || 0,
      newAssessors: parseInt(newAssessorsResult.rows[0].count) || 0,
      activeAssessors: parseInt(activeAssessorsResult.rows[0].count) || 0,
      totalDistricts: parseInt(districtsResult.rows[0].count) || 0,
      trends: {
        totalLeads: Math.floor(Math.random() * 20) - 10, // Mock trend data
        totalRevenue: Math.floor(Math.random() * 30) - 15,
        totalOverdue: Math.floor(Math.random() * 10) - 5,
        newAssessors: Math.floor(Math.random() * 15) - 7,
        activeAssessors: Math.floor(Math.random() * 10) - 5,
        totalDistricts: Math.floor(Math.random() * 8) - 4
      }
    };
  } catch (error) {
    console.error('Error getting dashboard metrics:', error);
    throw error;
  }
};

// Get area data for coverage management
const getAreaData = async () => {
  try {
    const result = await query(`
      SELECT
        LEFT(ap.postcode, 2) as area_code,
        COUNT(DISTINCT ap.assessor_id) as assessor_count,
        COUNT(*) as postcode_count,
        AVG(CAST(REPLACE(a.price, '£', '') AS DECIMAL)) as avg_price
      FROM assessor_postcodes ap
      JOIN assessors a ON ap.assessor_id = a.id
      WHERE ap.status = 'active' AND a.status = 'active'
      GROUP BY LEFT(ap.postcode, 2)
      ORDER BY assessor_count DESC
    `);

    return result.rows.map(row => ({
      areaCode: row.area_code,
      areaName: getAreaName(row.area_code),
      assessorCount: parseInt(row.assessor_count),
      postcodeCount: parseInt(row.postcode_count),
      averagePrice: parseFloat(row.avg_price) || 0,
      totalLeads: Math.floor(Math.random() * 100) + 10, // Mock data
      totalRevenue: Math.floor(Math.random() * 5000) + 1000, // Mock data
      missedRevenue: Math.floor(Math.random() * 500) // Mock data
    }));
  } catch (error) {
    console.error('Error getting area data:', error);
    throw error;
  }
};

// Helper function to get area names
const getAreaName = (areaCode) => {
  const areaNames = {
    'SW': 'South West London',
    'W1': 'West End',
    'WC': 'West Central London',
    'EC': 'East Central London',
    'E1': 'East London',
    'N1': 'North London',
    'NW': 'North West London',
    'SE': 'South East London',
    'B1': 'Birmingham Central',
    'M1': 'Manchester Central',
    'LS': 'Leeds',
    'CV': 'Coventry',
    'WV': 'Wolverhampton'
  };

  return areaNames[areaCode] || `${areaCode} Area`;
};

module.exports = {
  findAdminByEmail,
  findAdminById,
  getDashboardMetrics,
  getAreaData
};