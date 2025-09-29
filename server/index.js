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

app.listen(PORT, () => {
  console.log(`EPC Platform server running on port ${PORT}`);
});