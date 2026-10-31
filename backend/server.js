const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { connectDatabase } = require('./db');
const { HttpError } = require('./utils');

const app = express();
app.use(cors());
app.use(express.json());

// ---- REST API ----
app.get('/api/health', (req, res) => {
  const connected = mongoose.connection.readyState === 1;
  res.status(connected ? 200 : 503).json({ status: connected ? 'ok' : 'database unavailable' });
});

// Express 5 forwards rejected promises from async handlers to the error handler.
app.use('/api', (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return next(new HttpError(503, 'Database is unavailable. Make sure MongoDB is running.'));
  }
  next();
});
app.use('/api/students', require('./routes/students'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/enrollments', require('./routes/enrollments'));
app.use('/api', (req, res, next) => next(new HttpError(404, 'API route not found')));

// ---- Serve the Vue production build (with history-mode fallback) ----
const DIST_DIR = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(DIST_DIR));
app.use((req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return next();
  const indexFile = path.join(DIST_DIR, 'index.html');
  if (!fs.existsSync(indexFile)) {
    return res
      .status(503)
      .type('text/plain')
      .send('Frontend build not found. Run "npm run build" first.');
  }
  res.sendFile(indexFile);
});

// ---- Error handler ----
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ error: err.message, ...(err.fields && { fields: err.fields }) });
  }
  if (err.name === 'ValidationError') {
    const fields = {};
    for (const [key, e] of Object.entries(err.errors)) fields[key] = e.message;
    return res.status(400).json({ error: Object.values(fields)[0] || 'Validation failed', fields });
  }
  if (err.code === 11000) {
    const key = Object.keys(err.keyPattern || {})[0];
    const label = key === 'studentId' ? 'student ID' : key === 'courseId' ? 'course ID' : 'record';
    return res.status(409).json({ error: `A ${label} with that value already exists`, fields: key ? { [key]: 'Already exists' } : undefined });
  }
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON in request body' });
  }
  if (err.name === 'MongoServerSelectionError' || err.name === 'MongoNetworkError') {
    return res.status(503).json({ error: 'Database is unavailable. Make sure MongoDB is running.' });
  }
  console.error('Unexpected error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ---- Startup ----
async function start() {
  const port = process.env.PORT || 3000;
  try {
    await connectDatabase(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error(`Could not connect to MongoDB: ${err.message}`);
    console.error('Start MongoDB Community Edition locally and check MONGODB_URI in .env, then run again.');
    process.exit(1);
  }
  const server = app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));
  server.on('error', (err) => {
    console.error(`Could not start server: ${err.message}`);
    process.exit(1);
  });
  const shutdown = () => server.close(() => mongoose.disconnect().finally(() => process.exit(0)));
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

if (require.main === module) start();

module.exports = app;
