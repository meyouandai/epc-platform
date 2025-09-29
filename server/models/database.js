const { Pool } = require('pg');

// Check if we should use mock data or real database
const USE_MOCK_DATA = process.env.USE_MOCK_DATA === 'true' || !process.env.DATABASE_URL;

let pool;

if (!USE_MOCK_DATA) {
  // Database connection pool
  pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/epc_platform',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  // Test database connection
  pool.on('connect', () => {
    console.log('Connected to PostgreSQL database');
  });

  pool.on('error', (err) => {
    console.error('PostgreSQL connection error:', err);
    console.log('Falling back to mock data mode...');
  });
}

// Helper function to execute queries
const query = async (text, params) => {
  if (USE_MOCK_DATA) {
    console.log('🔄 Using mock data mode - query simulated:', text.slice(0, 50));
    return { rows: [], rowCount: 0 };
  }

  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Query executed', { text: text.slice(0, 50), duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Helper function to get a database client
const getClient = async () => {
  return await pool.connect();
};

module.exports = {
  pool,
  query,
  getClient
};