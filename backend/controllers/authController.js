const crypto = require('crypto');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const { sendPasswordResetEmail } = require('../services/mailService');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, college, experience, experienceLevel } = req.body;

    console.log(`[AUTH REGISTER] Request received for email: ${email ? String(email).toLowerCase().trim() : 'missing'}`);
    console.log(`[AUTH REGISTER] MongoDB connection state: ${mongoose.connection.readyState} (1=connected)`);

    if (mongoose.connection.readyState !== 1) {
      console.error('[AUTH REGISTER] MongoDB connection not ready (state: ' + mongoose.connection.readyState + ')');
      return res.status(500).json({
        message: 'Database service is temporarily unavailable. Please verify MongoDB Atlas connection and try again.'
      });
    }

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ message: 'Full name is required' });
    }

    if (!email || typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({ message: 'Email address is required' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    if (!password || typeof password !== 'string') {
      return res.status(400).json({ message: 'Password is required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    if (!/[A-Z]/.test(password)) {
      return res.status(400).json({ message: 'Password must contain at least one uppercase letter' });
    }

    if (!/[0-9]/.test(password)) {
      return res.status(400).json({ message: 'Password must contain at least one number' });
    }

    const exists = await User.findOne({ email: cleanEmail });
    if (exists) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const validExp = ['Beginner', 'Intermediate', 'Advanced'];
    const rawExp = experience || experienceLevel || 'Beginner';
    const resolvedExperience = validExp.includes(rawExp) ? rawExp : 'Beginner';

    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password,
      college: typeof college === 'string' ? college.trim() : '',
      experience: resolvedExperience,
      role: role === 'admin' ? 'admin' : 'candidate',
    });

    console.log(`[AUTH REGISTER] User registered successfully with id: ${user._id}`);
    const token = signToken(user._id);
    res.status(201).json({ token, user: user.toJSON() });
  } catch (err) {
    console.error('[AUTH REGISTER ERROR]', err.name, err.message);
    if (err.code === 11000) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }
    if (err.name === 'ValidationError') {
      const firstMsg = Object.values(err.errors || {})[0]?.message || 'Validation error';
      return res.status(400).json({ message: firstMsg });
    }
    res.status(500).json({ message: 'Unable to create your account due to a server error. Please try again.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = signToken(user._id);
    res.json({ token, user: user.toJSON() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProfile = async (req, res) => {
  res.json({ user: req.user });
};

// =========================================================================
// PASSWORD RESET
// =========================================================================

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(`[FORGOT PASSWORD] Request received for: ${email || 'unspecified'}`);

    if (!email) {
      return res.status(400).json({ message: 'Please provide an email address' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    console.log('[FORGOT PASSWORD] User lookup complete');

    if (!user) {
      // Return safe message without leaking user existence
      return res.json({ message: 'If an account exists for this email, a password reset link has been sent.' });
    }

    // Generate secure random 32-byte token
    const rawToken = crypto.randomBytes(32).toString('hex');

    // Hash token with SHA-256 for MongoDB storage
    user.resetPasswordToken = crypto.createHash('sha256').update(rawToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes
    await user.save({ validateBeforeSave: false });
    console.log('[FORGOT PASSWORD] Reset token generated');

    // Construct reset URL using configured CLIENT_URL
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const resetUrl = `${clientUrl}/reset-password/${rawToken}`;

    console.log('[FORGOT PASSWORD] Sending email');
    try {
      await sendPasswordResetEmail(user.email, resetUrl);
      console.log('[FORGOT PASSWORD] Email sent successfully');
      return res.json({ message: 'If an account exists for this email, a password reset link has been sent.' });
    } catch (mailErr) {
      console.error(`[FORGOT PASSWORD] Email send failed: ${mailErr.message}`);
      return res.status(500).json({ message: 'Unable to send reset email. Please try again.' });
    }
  } catch (err) {
    console.error(`[FORGOT PASSWORD] Email send failed: ${err.message}`);
    return res.status(500).json({ message: 'Unable to send reset email. Please try again.' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Hash incoming token to match database record
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Password reset link is invalid or has expired.' });
    }

    // Update password (pre('save') hook will hash it with bcrypt)
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    return res.json({ message: 'Password updated successfully.' });
  } catch (err) {
    console.error('resetPassword error:', err);
    res.status(500).json({ message: 'Unable to reset password right now' });
  }
};

// =========================================================================
// GOOGLE OAUTH
// =========================================================================

const { getGoogleConfig } = require('../config/googleOAuth');

exports.googleAuth = async (req, res) => {
  const config = getGoogleConfig();

  console.log('[GOOGLE AUTH] Login started');
  console.log('[ENV] cwd:', process.cwd());
  console.log('[ENV] GOOGLE_CLIENT_ID loaded:', !!process.env.GOOGLE_CLIENT_ID);
  console.log('[ENV] GOOGLE_CLIENT_SECRET loaded:', !!process.env.GOOGLE_CLIENT_SECRET);
  console.log('[GOOGLE CONFIG]', {
    clientIdLoaded: !!process.env.GOOGLE_CLIENT_ID,
    clientSecretLoaded: !!process.env.GOOGLE_CLIENT_SECRET,
  });

  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !config.isConfigured) {
    console.error('[GOOGLE AUTH] Failed: Missing or placeholder GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET');
    return res.redirect(
      `${config.frontendUrl}/auth/callback?error=${encodeURIComponent(
        'Google sign-in is not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in backend/.env'
      )}`
    );
  }

  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  const options = {
    redirect_uri: config.callbackUrl,
    client_id: config.clientId,
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent select_account',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ].join(' '),
  };

  const qs = new URLSearchParams(options).toString();
  return res.redirect(`${rootUrl}?${qs}`);
};

exports.googleCallback = async (req, res) => {
  const { clientId, clientSecret, callbackUrl, frontendUrl } = getGoogleConfig();
  const { code, error } = req.query;

  console.log('[GOOGLE AUTH] Callback received');

  if (error || !code) {
    const errorMsg = error === 'access_denied'
      ? 'Google sign-in was cancelled.'
      : 'Google sign-in could not be completed. Please try again.';
    console.error(`[GOOGLE AUTH] Failed: ${error || 'Missing auth code'}`);
    return res.redirect(`${frontendUrl}/auth/callback?error=${encodeURIComponent(errorMsg)}`);
  }

  try {
    // Exchange authorization code for tokens
    const tokenRes = await axios.post(
      'https://oauth2.googleapis.com/token',
      new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: callbackUrl,
        grant_type: 'authorization_code',
      }).toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const { access_token } = tokenRes.data;

    // Fetch user profile from Google
    const profileRes = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const { sub: googleId, email, name } = profileRes.data;
    if (!email) {
      console.error('[GOOGLE AUTH] Failed: No email returned in Google profile');
      return res.redirect(
        `${frontendUrl}/auth/callback?error=${encodeURIComponent('Google profile does not contain an email address.')}`
      );
    }

    // Account Matching: Check googleId first, then email
    let user = await User.findOne({
      $or: [{ googleId }, { email: email.toLowerCase().trim() }],
    });

    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save({ validateBeforeSave: false });
      }
    } else {
      user = await User.create({
        name: name || email.split('@')[0],
        email: email.toLowerCase().trim(),
        googleId,
        password: crypto.randomBytes(32).toString('hex'),
        role: 'candidate',
      });
    }

    const token = signToken(user._id);
    console.log('[GOOGLE AUTH] User authenticated');
    console.log('[GOOGLE AUTH] Redirecting to frontend');

    return res.redirect(
      `${frontendUrl}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify(user.toJSON()))}`
    );
  } catch (err) {
    const safeError = err.response?.data?.error_description || err.response?.data?.error || err.message;
    console.error(`[GOOGLE AUTH] Failed: ${safeError}`);
    return res.redirect(
      `${frontendUrl}/auth/callback?error=${encodeURIComponent('Google sign-in could not be completed. Please try again.')}`
    );
  }
};

// =========================================================================
// GITHUB OAUTH
// =========================================================================

exports.githubAuth = async (req, res) => {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = process.env;

  console.log('[AUTH][GITHUB] Login started');

  if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
    console.error('[AUTH][GITHUB] OAuth failed: Missing GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET');
    return res.redirect(
      `${clientUrl}/auth/callback?error=${encodeURIComponent(
        'GitHub sign-in is not configured. Please set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in backend/.env'
      )}`
    );
  }

  const backendUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;
  const redirectUri = process.env.GITHUB_CALLBACK_URL || `${backendUrl}/api/auth/github/callback`;
  const rootUrl = 'https://github.com/login/oauth/authorize';
  const options = {
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: redirectUri,
    scope: 'user:email',
  };

  const qs = new URLSearchParams(options).toString();
  return res.redirect(`${rootUrl}?${qs}`);
};

exports.githubCallback = async (req, res) => {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const { code, error, error_description } = req.query;

  console.log('[AUTH][GITHUB] Callback received');

  if (error || !code) {
    const errorMsg = error === 'access_denied'
      ? 'GitHub sign-in was cancelled.'
      : 'GitHub sign-in could not be completed. Please try again.';
    console.error(`[AUTH][GITHUB] OAuth failed: ${error_description || error || 'Missing auth code'}`);
    return res.redirect(`${clientUrl}/auth/callback?error=${encodeURIComponent(errorMsg)}`);
  }

  try {
    const backendUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;
    const redirectUri = process.env.GITHUB_CALLBACK_URL || `${backendUrl}/api/auth/github/callback`;

    // Exchange authorization code for access token
    const tokenRes = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: redirectUri,
      },
      { headers: { Accept: 'application/json' } }
    );

    const { access_token, error: tokenError, error_description: tokenErrorDesc } = tokenRes.data;
    if (!access_token) {
      console.error(`[AUTH][GITHUB] OAuth failed: ${tokenErrorDesc || tokenError || 'No access token received'}`);
      return res.redirect(
        `${clientUrl}/auth/callback?error=${encodeURIComponent('GitHub token exchange failed. Please try again.')}`
      );
    }

    // Fetch user profile from GitHub
    const profileRes = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${access_token}`,
        'User-Agent': 'SmartInterview-AI',
      },
    });

    const profile = profileRes.data;
    const githubId = String(profile.id);
    let email = profile.email;

    // Handle edge case: user:email scope to fetch verified private email
    if (!email) {
      try {
        const emailsRes = await axios.get('https://api.github.com/user/emails', {
          headers: {
            Authorization: `Bearer ${access_token}`,
            'User-Agent': 'SmartInterview-AI',
          },
        });
        if (Array.isArray(emailsRes.data)) {
          const primaryEmailObj = emailsRes.data.find((e) => e.primary && e.verified) || emailsRes.data[0];
          if (primaryEmailObj?.email) {
            email = primaryEmailObj.email;
          }
        }
      } catch (emailErr) {
        console.warn('[AUTH][GITHUB] Private email query warning:', emailErr.message);
      }
    }

    if (!email) {
      email = `${profile.login}@users.noreply.github.com`;
    }

    // Account Matching: Check githubId first, then email
    let user = await User.findOne({
      $or: [{ githubId }, { email: email.toLowerCase().trim() }],
    });

    if (user) {
      if (!user.githubId) {
        user.githubId = githubId;
        await user.save({ validateBeforeSave: false });
      }
    } else {
      user = await User.create({
        name: profile.name || profile.login,
        email: email.toLowerCase().trim(),
        githubId,
        password: crypto.randomBytes(32).toString('hex'),
        role: 'candidate',
      });
    }

    const token = signToken(user._id);
    console.log(`[AUTH][GITHUB] User authenticated: ${user.email}`);

    return res.redirect(
      `${clientUrl}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify(user.toJSON()))}`
    );
  } catch (err) {
    const safeError = err.response?.data?.error_description || err.response?.data?.error || err.message;
    console.error(`[AUTH][GITHUB] OAuth failed: ${safeError}`);
    return res.redirect(
      `${clientUrl}/auth/callback?error=${encodeURIComponent('GitHub sign-in could not be completed. Please try again.')}`
    );
  }
};
