// ============================================
// AccessFlow Backend Server - index.js
// ============================================

// Import required dependencies
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pa11y = require('pa11y'); // <-- New import
require('dotenv').config();

// Initialize Express app
const app = express();


// Middleware Configuration
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());

// Database Connection Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
  } else {
    console.log('✓ Database connected successfully');
    release();
  }
});

// ============================================
// Authentication Middleware
// ============================================

const checkAuth = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'No token provided. Authorization header must be in format: Bearer <token>' 
      });
    }

    // Extract token (remove 'Bearer ' prefix)
    const token = authHeader.substring(7);

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user data to request object
    req.user = { userId: decoded.userId };
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(401).json({ error: 'Authentication failed' });
  }
};

// ============================================
// Authentication Routes (No Auth Required)
// ============================================

// POST /api/auth/register - Register a new user
app.post('/api/auth/register', async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    const userExists = await client.query(
      'SELECT user_id FROM users WHERE email = $1',
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    // Hash the password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Begin transaction
    await client.query('BEGIN');

    // Insert new user into users table
    const insertUserResult = await client.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING user_id, name, email',
      [name, email, password_hash]
    );

    const newUser = insertUserResult.rows[0];

    // Create empty profile for the new user
    await client.query(
      'INSERT INTO profiles (user_id, settings) VALUES ($1, $2)',
      [newUser.user_id, JSON.stringify({})]
    );

    // Commit transaction
    await client.query('COMMIT');

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.user_id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return success response
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        user_id: newUser.user_id,
        name: newUser.name,
        email: newUser.email
      }
    });

  } catch (error) {
    // Rollback transaction on error
    await client.query('ROLLBACK');
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  } finally {
    client.release();
  }
});

// POST /api/auth/login - Login existing user
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user by email
    const result = await pool.query(
      'SELECT user_id, name, email, password_hash FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];

    // Compare password with hash
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.user_id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return success response
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// ============================================
// Profile Routes (Auth Required)
// ============================================

// GET /api/profile - Get user profile settings
app.get('/api/profile', checkAuth, async (req, res) => {
  try {
    const { userId } = req.user;

    const result = await pool.query(
      `SELECT 
         u.user_id, 
         u.name, 
         u.email, 
         p.profile_id, 
         p.settings 
       FROM users u
       LEFT JOIN profiles p ON u.user_id = p.user_id
       WHERE u.user_id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const profileData = result.rows[0];

    if (!profileData.profile_id) {
        return res.status(404).json({ error: 'Profile not found for this user' });
    }

    res.status(200).json({
      user_id: profileData.user_id,
      name: profileData.name,
      email: profileData.email,
      profile_id: profileData.profile_id,
      settings: profileData.settings
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Server error fetching profile' });
  }
});

// PUT /api/profile - Update user profile settings
app.put('/api/profile', checkAuth, async (req, res) => {
  try {
    const { userId } = req.user;
    const { settings } = req.body;

    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({ error: 'Settings must be a valid object' });
    }

    const result = await pool.query(
      'UPDATE profiles SET settings = $1 WHERE user_id = $2 RETURNING profile_id, user_id, settings',
      [JSON.stringify(settings), userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const updatedProfile = result.rows[0];

    res.status(200).json({
      message: 'Profile updated successfully',
      profile: updatedProfile
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error updating profile' });
  }
});


// ============================================
// Scan Routes (Auth Required)
// ============================================

// POST /api/scans - Run a new scan
app.post('/api/scans', checkAuth, async (req, res) => {
  const { url } = req.body;
  const { userId } = req.user;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  const client = await pool.connect();
  try {
    // Run the pa11y scan
    const results = await pa11y(url);

    // Scan succeeded, save to DB
    const insertQuery = `
      INSERT INTO scans (user_id, url, status, results)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const scanData = await client.query(insertQuery, [
      userId,
      url,
      'completed',
      JSON.stringify(results) // Store results as JSONB
    ]);

    res.status(201).json(scanData.rows[0]);

  } catch (error) {
    // Scan failed, save the error to DB
    console.error('Scan error:', error.message);
    
    try {
      const insertQuery = `
        INSERT INTO scans (user_id, url, status, results)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;
      // Create a simple error object to store
      const errorResult = { 
        name: error.name || 'ScanError',
        message: error.message || 'An unknown error occurred during the scan.'
      };

      const scanData = await client.query(insertQuery, [
        userId,
        url,
        'failed',
        JSON.stringify(errorResult) // Store the error message as JSONB
      ]);
      
      // Return the "failed scan" record, but with a 500 status
      // because the scan itself failed.
      res.status(500).json(scanData.rows[0]);

    } catch (dbError) {
      // If saving the error to the DB *also* fails
      console.error('DB error after scan failure:', dbError);
      res.status(500).json({ error: 'Scan failed and could not be logged.' });
    }
  } finally {
    client.release();
  }
});

// GET /api/scans - Get all of a user's scans
app.get('/api/scans', checkAuth, async (req, res) => {
  const { userId } = req.user;

  try {
    const result = await pool.query(
      'SELECT * FROM scans WHERE user_id = $1 ORDER BY scanned_at DESC',
      [userId]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Get scans error:', error);
    res.status(500).json({ error: 'Server error fetching scans' });
  }
});


// ============================================
// Health Check Route
// ============================================

app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'AccessFlow API is running',
    timestamp: new Date().toISOString()
  });
});

// ============================================
// 404 Handler
// ============================================

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ============================================
// Server Start
// ============================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   AccessFlow Backend Server Started    ║
╠════════════════════════════════════════╣
║   Port: ${PORT}                        ║
║   Environment: ${process.env.NODE_ENV || 'development'}          ║
║   Frontend URL: ${process.env.FRONTEND_URL}  ║
╚════════════════════════════════════════╝
  `);
});

