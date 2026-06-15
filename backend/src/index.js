const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./db/db');

const authRoutes = require('./routes/auth');
const reportRoutes = require('./routes/reports');

const app = express();

app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'https://construction-daily-log.vercel.app'
    ];
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Construction Daily Log API is running!', status: 'healthy' });
});

app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);

// Handle routes that don't exist
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler — catches any unhandled errors
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Keep-alive ping every 14 minutes — keeps Render awake AND Supabase active
if (process.env.NODE_ENV === 'production') {
  setInterval(async () => {
    try {
      // Keep Render awake
      const https = require('https');
      https.get('https://construction-daily-log-api.onrender.com/', (res) => {
        console.log(`Keep-alive ping — status: ${res.statusCode}`);
      }).on('error', (err) => {
        console.log('Keep-alive failed:', err.message);
      });

      // Keep Supabase awake
      const pool = require('./db/db');
      await pool.query('SELECT 1');
      console.log('Database keep-alive ping sent');
    } catch (err) {
      console.log('DB keep-alive failed:', err.message);
    }
  }, 14 * 60 * 1000);
}

// Handle uncaught exceptions — prevents full crash
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message);
});

// Handle unhandled promise rejections — prevents silent failures
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;