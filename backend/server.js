const path = require('path');
const dotenv = require('dotenv');

// Explicitly resolve and load backend/.env before importing any route or OAuth config
const envPath = path.resolve(__dirname, '.env');
dotenv.config({ path: envPath });

// STEP 1: Startup safe logs
console.log("[ENV] cwd:", process.cwd());
console.log("[ENV] loaded from:", envPath);
console.log("[ENV] GOOGLE_CLIENT_ID loaded:", !!process.env.GOOGLE_CLIENT_ID);
console.log("[ENV] GOOGLE_CLIENT_SECRET loaded:", !!process.env.GOOGLE_CLIENT_SECRET);

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Connect DB
connectDB();

// Allowed origins
const rawOrigins = [
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000',
].filter(Boolean);

const allowedOrigins = Array.from(
  new Set(
    rawOrigins.flatMap(url =>
      typeof url === 'string'
        ? url.split(',').map(u => u.trim().replace(/\/+$/, ''))
        : []
    )
  )
).filter(Boolean);

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server, or Render health check)
      if (!origin) return callback(null, true);
      const normalizedOrigin = origin.trim().replace(/\/+$/, '');
      if (allowedOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }
      // Allow Vercel preview deployments if a Vercel domain is configured in allowedOrigins
      const hasVercelConfigured = allowedOrigins.some(ao => ao.includes('.vercel.app'));
      if (hasVercelConfigured && normalizedOrigin.endsWith('.vercel.app')) {
        return callback(null, true);
      }
      if (process.env.NODE_ENV !== 'production') {
        return callback(null, true); // Permissive in dev to avoid CORS blocking redirects
      }
      console.warn(`[CORS REJECTED] Origin: ${origin} not in allowed origins:`, allowedOrigins);
      return callback(new Error(`CORS blocked request from origin: ${origin}`));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));

// Health check endpoints for Render, uptime monitors, and load balancers
app.get(['/health', '/api/health'], (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/interviews', require('./routes/interviews'));
app.use('/api/assessment', require('./routes/assessment'));
app.use('/api/communication', require('./routes/communication'));
app.use('/api/speaking-challenge', require('./routes/speakingChallenge'));
app.use('/api/aptitude', require('./routes/aptitude'));
app.use('/api/technical-practice', require('./routes/technicalPractice'));
app.use('/api/problem-solving', require('./routes/problemSolving'));

// 404
app.use((req, res) => res.status(404).json({ message: `Route ${req.originalUrl} not found` }));

// Global error handler
app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]', err);
  const statusCode = err.statusCode || err.status || 500;
  const isProd = process.env.NODE_ENV === 'production';
  const message = isProd && statusCode === 500
    ? 'Internal server error'
    : (err.message || 'Internal server error');
  res.status(statusCode).json({ message });
});

const { getGoogleConfig } = require('./config/googleOAuth');

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend running on port ${PORT}`);

  // Safe Google OAuth startup check
  const googleConfig = getGoogleConfig();
  console.log(`[GOOGLE AUTH] GOOGLE_CLIENT_ID loaded: ${Boolean(googleConfig.clientId && !googleConfig.clientId.toUpperCase().includes('YOUR_'))}`);
  console.log(`[GOOGLE AUTH] GOOGLE_CLIENT_SECRET loaded: ${Boolean(googleConfig.clientSecret && !googleConfig.clientSecret.toUpperCase().includes('YOUR_'))}`);
  console.log("[GOOGLE CONFIG]", {
    clientIdLoaded: !!process.env.GOOGLE_CLIENT_ID,
    clientSecretLoaded: !!process.env.GOOGLE_CLIENT_SECRET,
  });

  if (!googleConfig.isConfigured) {
    console.log('[GOOGLE AUTH] Not configured: set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in backend/.env');
  } else {
    console.log('[GOOGLE AUTH] Configuration loaded successfully');
  }

  // Safe GitHub OAuth startup check
  const githubClientId = (process.env.GITHUB_CLIENT_ID || '').trim();
  const githubClientSecret = (process.env.GITHUB_CLIENT_SECRET || '').trim();
  if (!githubClientId || !githubClientSecret) {
    console.log('[AUTH] GitHub OAuth not configured');
  } else {
    console.log('[AUTH] GitHub OAuth configured');
  }
});
