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

// Database setup endpoint (temporary)
app.post('/api/setup-database', async (req, res) => {
  try {
    const { query } = require('./models/database');
    const bcrypt = require('bcryptjs');
    const fs = require('fs');
    const path = require('path');

    // Read the schema file
    const schemaPath = path.join(__dirname, 'database', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Execute the schema
    await query(schema);

    // Create default admin user with specific ID to match JWT tokens
    const hashedPassword = await bcrypt.hash('password123', 10);
    await query(`
      INSERT INTO admins (id, name, email, password)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) DO NOTHING
    `, ['admin_001', 'Platform Administrator', 'admin@epcplatform.com', hashedPassword]);

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