const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use(helmet());
app.use(limiter);

// Enhanced CORS configuration for Vercel deployment
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://epc-platform-14n4h0mco-craig-meyouandaics-projects.vercel.app',
    'https://epc-platform-git-main-craig-meyouandaics-projects.vercel.app',
    /^https:\/\/.*\.vercel\.app$/
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));

// Debug middleware for admin routes
app.use('/api/admin', (req, res, next) => {
  console.log(`🔍 Admin request: ${req.method} ${req.url}`);
  console.log(`🌐 Origin: ${req.headers.origin}`);
  console.log(`📝 Headers:`, req.headers);
  console.log(`📦 Body:`, req.body);
  next();
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'EPC Platform API is running', timestamp: new Date().toISOString() });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/assessors', require('./routes/assessors'));
app.use('/api/leads', require('./routes/leads'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/simple', require('./routes/simple'));

// Database seed endpoint
app.post('/api/seed-database', async (req, res) => {
  try {
    const { query } = require('./models/database');
    const bcrypt = require('bcryptjs');

    // Hash password for test assessors
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create test assessors
    const assessors = [
      {
        name: 'John Smith',
        company: 'Smith Energy Assessments',
        email: 'john@smithenergy.com',
        phone: '020 7123 4567',
        price: '£85',
        lat: 51.5014,
        lng: -0.1419
      },
      {
        name: 'Sarah Johnson',
        company: 'Green Home Surveys',
        email: 'sarah@greenhome.com',
        phone: '020 7234 5678',
        price: '£75',
        lat: 51.5012,
        lng: -0.1405
      },
      {
        name: 'Mike Williams',
        company: 'Eco Property Assessments',
        email: 'mike@ecopropertyuk.com',
        phone: '020 7345 6789',
        price: '£90',
        lat: 51.5009,
        lng: -0.1399
      },
      {
        name: 'Emma Davis',
        company: 'London EPC Solutions',
        email: 'emma@londonepc.com',
        phone: '020 7456 7890',
        price: '£80',
        lat: 51.5018,
        lng: -0.1423
      }
    ];

    const createdAssessors = [];

    for (const assessor of assessors) {
      const result = await query(`
        INSERT INTO assessors (name, company, email, password, phone, price, lat, lng, status, verified, rating, review_count)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'active', true, $9, $10)
        ON CONFLICT (email) DO UPDATE
        SET name = EXCLUDED.name, company = EXCLUDED.company
        RETURNING *
      `, [
        assessor.name,
        assessor.company,
        assessor.email,
        hashedPassword,
        assessor.phone,
        assessor.price,
        assessor.lat,
        assessor.lng,
        Math.floor(Math.random() * 2) + 4,
        Math.floor(Math.random() * 50) + 10
      ]);

      createdAssessors.push(result.rows[0]);
    }

    // Add postcodes for each assessor
    const postcodes = ['SW1A', 'SW1P', 'SW1V', 'SW1W', 'SW1X', 'SW1Y', 'W1K', 'W1J'];

    for (const assessor of createdAssessors) {
      const numPostcodes = Math.floor(Math.random() * 4) + 3;
      const selectedPostcodes = postcodes.slice(0, numPostcodes);

      for (const postcode of selectedPostcodes) {
        await query(`
          INSERT INTO assessor_postcodes (assessor_id, postcode, price, status)
          VALUES ($1, $2, $3, 'active')
          ON CONFLICT (assessor_id, postcode) DO NOTHING
        `, [assessor.id, postcode, parseFloat(assessor.price.replace('£', ''))]);
      }
    }

    res.json({
      success: true,
      message: `Created ${createdAssessors.length} assessors with postcode coverage`
    });
  } catch (error) {
    console.error('Database seed error:', error);
    res.status(500).json({
      error: 'Database seed failed',
      details: error.message
    });
  }
});

// Database setup endpoint (temporary)
app.post('/api/setup-database', async (req, res) => {
  try {
    const { query } = require('./models/database');
    const bcrypt = require('bcryptjs');

    // Create tables without PostGIS dependencies

    // Enable UUID extension
    await query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Drop and recreate assessors table to ensure correct schema
    await query(`DROP TABLE IF EXISTS assessor_postcodes CASCADE`);
    await query(`DROP TABLE IF EXISTS lead_assessors CASCADE`);
    await query(`DROP TABLE IF EXISTS assessors CASCADE`);

    // Create assessors table without PostGIS
    await query(`
      CREATE TABLE IF NOT EXISTS assessors (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        company VARCHAR(255),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        rating DECIMAL(2,1) DEFAULT 0.0,
        review_count INTEGER DEFAULT 0,
        price VARCHAR(20) DEFAULT '£80',
        verified BOOLEAN DEFAULT FALSE,
        status VARCHAR(50) DEFAULT 'active',
        lat DECIMAL(10, 8),
        lng DECIMAL(11, 8),
        stripe_customer_id VARCHAR(255),
        trust_level VARCHAR(20) DEFAULT 'bronze',
        spending_threshold DECIMAL(10,2) DEFAULT 250.00,
        current_period_spend DECIMAL(10,2) DEFAULT 0.00,
        total_successful_payments INTEGER DEFAULT 0,
        account_paused BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        approved_at TIMESTAMP WITH TIME ZONE,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create admins table
    await query(`
      CREATE TABLE IF NOT EXISTS admins (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create leads table without PostGIS
    await query(`
      CREATE TABLE IF NOT EXISTS leads (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        customer_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        address TEXT NOT NULL,
        postcode VARCHAR(20) NOT NULL,
        property_type VARCHAR(50) NOT NULL,
        bedrooms INTEGER,
        timeframe VARCHAR(50) NOT NULL,
        additional_info TEXT,
        status VARCHAR(50) DEFAULT 'new',
        price DECIMAL(10,2) NOT NULL,
        lat DECIMAL(10, 8),
        lng DECIMAL(11, 8),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create other tables
    await query(`
      CREATE TABLE IF NOT EXISTS lead_assessors (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
        assessor_id UUID REFERENCES assessors(id) ON DELETE CASCADE,
        assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(50) DEFAULT 'assigned',
        notes TEXT,
        UNIQUE(lead_id, assessor_id)
      )
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS assessor_postcodes (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        assessor_id UUID REFERENCES assessors(id) ON DELETE CASCADE,
        postcode VARCHAR(20) NOT NULL,
        status VARCHAR(20) DEFAULT 'active',
        price DECIMAL(10,2) NOT NULL,
        added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(assessor_id, postcode)
      )
    `);

    // Create indexes
    await query(`CREATE INDEX IF NOT EXISTS idx_assessors_email ON assessors(email)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_assessors_status ON assessors(status)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_leads_postcode ON leads(postcode)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status)`);

    // Create default admin user with specific UUID that matches JWT tokens
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Use a fixed UUID for admin_001 (instead of string)
    const adminUuid = '00000000-0000-0000-0000-000000000001';

    // First delete any existing admin user to ensure clean state
    await query(`DELETE FROM admins WHERE email = $1`, ['admin@epcplatform.com']);

    // Then create admin user with correct UUID
    await query(`
      INSERT INTO admins (id, name, email, password)
      VALUES ($1, $2, $3, $4)
    `, [adminUuid, 'Platform Administrator', 'admin@epcplatform.com', hashedPassword]);

    res.json({
      success: true,
      message: 'Database schema and admin user created successfully'
    });
  } catch (error) {
    console.error('Database setup error:', error);
    res.status(500).json({
      error: 'Database setup failed',
      details: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`EPC Platform server running on port ${PORT}`);
});