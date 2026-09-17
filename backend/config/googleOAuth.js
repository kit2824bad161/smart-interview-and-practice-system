const path = require('path');
const dotenv = require('dotenv');

// Explicitly resolve the backend/.env path regardless of where node was executed
const envPath = path.resolve(__dirname, '..', '.env');
dotenv.config({ path: envPath });

/**
 * Reads, trims, and validates Google OAuth configuration from backend/.env.
 * Uses exact normalized variable names: GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.
 */
function getGoogleConfig() {
  // Reload dotenv safely to capture any updates made to .env
  dotenv.config({ path: envPath });

  const clientId = (process.env.GOOGLE_CLIENT_ID || '')
    .trim()
    .replace(/^["']|["']$/g, '');

  const clientSecret = (process.env.GOOGLE_CLIENT_SECRET || '')
    .trim()
    .replace(/^["']|["']$/g, '');

  const backendPort = process.env.PORT || 5000;
  const backendBase = process.env.BACKEND_URL || `http://localhost:${backendPort}`;
  const callbackUrl = (
    process.env.GOOGLE_CALLBACK_URL ||
    process.env.GOOGLE_REDIRECT_URI ||
    `${backendBase}/api/auth/google/callback`
  )
    .trim()
    .replace(/^["']|["']$/g, '');

  const frontendUrl = (
    process.env.FRONTEND_URL ||
    process.env.CLIENT_URL ||
    'http://localhost:5173'
  )
    .trim()
    .replace(/^["']|["']$/g, '');

  const isConfigured = Boolean(
    clientId &&
    clientSecret &&
    !clientId.toUpperCase().includes('YOUR_') &&
    !clientSecret.toUpperCase().includes('YOUR_')
  );

  return {
    clientId,
    clientSecret,
    callbackUrl,
    frontendUrl,
    backendPort,
    isConfigured,
    envPath,
  };
}

module.exports = {
  getGoogleConfig,
  envPath,
};
