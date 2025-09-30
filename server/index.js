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
app.use(cors());
app.use(express.json({ limit: '10mb' }));

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
    const fs = require('fs');
    const path = require('path');

    // Read the schema file
    const schemaPath = path.join(__dirname, 'database', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Execute the schema
    await query(schema);

    res.json({
      success: true,
      message: 'Database schema created successfully'
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