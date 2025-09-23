const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const { connectDB, getConnectionStatus } = require('./config/db');

dotenv.config();

const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

// Routes
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'OK', data: { db: getConnectionStatus() } });
});

app.use('/auth', require('./routes/auth'));
app.use('/courses', require('./routes/courses'));
// Mount tests router at root to expose exact paths
app.use('/', require('./routes/tests'));

// Exact spec route: GET /next-difficulty/:userId
const auth = require('./middleware/auth');
const { getNextDifficulty } = require('./controllers/testsController');
app.get('/next-difficulty/:userId', auth, getNextDifficulty);

// Central error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ success: false, message: err.message || 'Server error', data: { error: err.stack } });
});

const PORT = process.env.PORT || 5000;
connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((e) => {
    console.error('DB connection failed', e);
    process.exit(1);
  });


