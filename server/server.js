const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const nodemailer = require('nodemailer'); // Disabled for in-memory demo
// const mongoose = require('mongoose'); // Disabled for in-memory demo
// const { OAuth2Client } = require('google-auth-library'); // Temporarily disabled
// require('dotenv').config(); // Temporarily disabled

const app = express();
const PORT = 5001; // Fixed port for demo

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003', 'http://localhost:3004'],
  credentials: true
}));
app.use(express.json());

// In-memory storage for demo (replace with MongoDB in production)
const users = [];
let userIdCounter = 1;

// MongoDB Connection (disabled for demo)
// const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pgrenter';
// mongoose.connect(MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// db.once('open', () => {
//   console.log('Connected to MongoDB');
// });

console.log('Using in-memory storage for demo (MongoDB disabled)');

// Simple User class for in-memory storage
class User {
  constructor(userData) {
    this._id = userIdCounter++;
    this.name = userData.name;
    this.email = userData.email.toLowerCase();
    this.password = userData.password;
    this.googleId = userData.googleId || null;
    this.picture = userData.picture || null;
    this.provider = userData.provider || 'local';
    this.createdAt = new Date();
    this.lastLogin = new Date();
  }

  static async findOne(query) {
    if (query.email) {
      return users.find(user => user.email === query.email.toLowerCase());
    }
    if (query.$or) {
      return users.find(user => 
        query.$or.some(condition => 
          (condition.googleId && user.googleId === condition.googleId) ||
          (condition.email && user.email === condition.email)
        )
      );
    }
    return null;
  }

  static async findById(id) {
    return users.find(user => user._id == id);
  }

  static async find() {
    return users;
  }

  async save() {
    const existingIndex = users.findIndex(user => user._id === this._id);
    if (existingIndex >= 0) {
      users[existingIndex] = this;
    } else {
      users.push(this);
    }
    return this;
  }
}

// Google OAuth Client (Temporarily Disabled)
// const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// JWT Secret (Temporarily using fixed value)
const JWT_SECRET = 'demo-secret-key-for-testing';

// JWT Verification Middleware (Temporarily Disabled)
/*
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token.' });
  }
};
*/


// Email Configuration (Temporarily Disabled)
/* const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
}); */

// In-memory storage for inquiries
const inquiries = [];
let inquiryIdCounter = 1;

// Inquiry class for in-memory storage
class Inquiry {
  constructor(inquiryData) {
    this._id = inquiryIdCounter++;
    this.userId = inquiryData.userId;
    this.userName = inquiryData.userName;
    this.userEmail = inquiryData.userEmail;
    this.userPhone = inquiryData.userPhone || null;
    this.pgName = inquiryData.pgName;
    this.pgLocation = inquiryData.pgLocation;
    this.pgPrice = inquiryData.pgPrice;
    this.message = inquiryData.message;
    this.status = 'pending'; // pending, contacted, closed
    this.createdAt = new Date();
  }

  static async find(query = {}) {
    if (query.userId) {
      return inquiries.filter(inquiry => inquiry.userId == query.userId);
    }
    return inquiries;
  }

  async save() {
    const existingIndex = inquiries.findIndex(inquiry => inquiry._id === this._id);
    if (existingIndex >= 0) {
      inquiries[existingIndex] = this;
    } else {
      inquiries.push(this);
    }
    return this;
  }
}

// Helper function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

// Routes

// Test route to check if server is working
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!', timestamp: new Date().toISOString() });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    message: 'PG Renter server is running',
    port: PORT,
    environment: process.env.NODE_ENV || 'development'
  });
});

// Working Authentication Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    console.log('Registration request received:', { name, email });

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      provider: 'local'
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    console.log('User registered successfully:', user.email);

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        provider: user.provider,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Login request received:', { email });

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Check if user registered with Google
    if (user.provider === 'google') {
      return res.status(400).json({ error: 'This email is registered with Google. Please use Google Sign-In.' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    console.log('User logged in successfully:', user.email);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        provider: user.provider,
        lastLogin: user.lastLogin
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Register with email/password
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      provider: 'local'
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        provider: user.provider,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Login with email/password
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Check if user registered with Google
    if (user.provider === 'google') {
      return res.status(400).json({ error: 'This email is registered with Google. Please use Google Sign-In.' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        provider: user.provider,
        lastLogin: user.lastLogin
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Google OAuth Login/Register (Temporarily Disabled)
/* app.post('/api/auth/google', async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ error: 'Google credential is required' });
    }

    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    // Check if user exists
    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (user) {
      // User exists - update login time and Google info if needed
      user.lastLogin = new Date();
      if (!user.googleId) {
        user.googleId = googleId;
        user.provider = 'google';
        user.picture = picture;
      }
      await user.save();
    } else {
      // Create new user
      user = new User({
        name,
        email,
        googleId,
        picture,
        provider: 'google'
      });
      await user.save();
    }

    // Generate token
    const token = generateToken(user._id);

    const isNewUser = Math.abs(user.createdAt.getTime() - user.lastLogin.getTime()) < 1000; // Within 1 second
    
    res.json({
      message: isNewUser ? 'Account created successfully' : 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        provider: user.provider,
        googleId: user.googleId,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      }
    });

  } catch (error) {
    console.error('Google OAuth error:', error);
    res.status(500).json({ error: 'Server error during Google authentication' });
  }
}); */

// Get current user (protected route) - Temporarily Disabled
/*
app.get('/api/auth/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        provider: user.provider,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user profile (protected route)
app.put('/api/auth/profile', verifyToken, async (req, res) => {
  try {
    const { name, email } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update name
    user.name = name.trim();

    // Update email only for local accounts
    if (user.provider === 'local' && email && email.trim()) {
      const emailLower = email.toLowerCase().trim();
      
      // Check if email is already taken by another user
      const existingUser = await User.findOne({ email: emailLower });
      if (existingUser && existingUser._id !== user._id) {
        return res.status(400).json({ error: 'Email is already taken' });
      }
      
      user.email = emailLower;
    }

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        provider: user.provider,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error during profile update' });
  }
});

// Submit PG inquiry (Temporarily Disabled)
/* app.post('/api/inquiries', verifyToken, async (req, res) => {
  try {
    const { pgName, pgLocation, pgPrice, message, userPhone } = req.body;
    
    // Get user details
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Validate required fields
    if (!pgName || !pgLocation || !message) {
      return res.status(400).json({ error: 'PG name, location, and message are required' });
    }

    // Create new inquiry
    const inquiry = new Inquiry({
      userId: user._id,
      userName: user.name,
      userEmail: user.email,
      userPhone: userPhone,
      pgName,
      pgLocation,
      pgPrice,
      message
    });

    await inquiry.save();

    // Send email notification
    try {
      const emailContent = `
        <h2>New PG Inquiry Received</h2>
        <p><strong>Student Details:</strong></p>
        <ul>
          <li><strong>Name:</strong> ${user.name}</li>
          <li><strong>Email:</strong> ${user.email}</li>
          <li><strong>Phone:</strong> ${userPhone || 'Not provided'}</li>
          <li><strong>Registration Date:</strong> ${new Date(user.createdAt).toLocaleDateString()}</li>
        </ul>
        
        <p><strong>PG Details:</strong></p>
        <ul>
          <li><strong>PG Name:</strong> ${pgName}</li>
          <li><strong>Location:</strong> ${pgLocation}</li>
          <li><strong>Price:</strong> ${pgPrice}</li>
        </ul>
        
        <p><strong>Student Message:</strong></p>
        <blockquote style="background: #f5f5f5; padding: 15px; border-left: 4px solid #007bff;">
          ${message}
        </blockquote>
        
        <p><strong>Inquiry Date:</strong> ${new Date().toLocaleString()}</p>
        
        <hr>
        <p style="color: #666; font-size: 12px;">
          This inquiry was submitted through PG Renter platform. Please respond to the student directly at ${user.email}
        </p>
      `;

      await transporter.sendMail({
        from: process.env.EMAIL_FROM || 'noreply@pgrenter.com',
        to: process.env.EMAIL_TO || 'mayankkumar31k@gmail.com',
        subject: `New PG Inquiry: ${user.name} interested in ${pgName}`,
        html: emailContent
      });

      console.log('Inquiry email sent successfully');
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      message: 'Inquiry submitted successfully',
      inquiry: {
        id: inquiry._id,
        pgName: inquiry.pgName,
        pgLocation: inquiry.pgLocation,
        status: inquiry.status,
        createdAt: inquiry.createdAt
      }
    });

  } catch (error) {
    console.error('Inquiry submission error:', error);
    res.status(500).json({ error: 'Server error during inquiry submission' });
  }
}); */

// Get user's inquiries (temporarily disabled auth)
app.get('/api/inquiries', async (req, res) => {
  try {
    const userInquiries = await Inquiry.find();
    
    const formattedInquiries = userInquiries.map(inquiry => ({
      id: inquiry._id,
      pgName: inquiry.pgName,
      pgLocation: inquiry.pgLocation,
      pgPrice: inquiry.pgPrice,
      message: inquiry.message,
      userPhone: inquiry.userPhone,
      status: inquiry.status,
      createdAt: inquiry.createdAt
    }));

    res.json({ inquiries: formattedInquiries });
  } catch (error) {
    console.error('Get inquiries error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all users (for testing - remove in production)
app.get('/api/users', async (req, res) => {
  try {
    const allUsers = await User.find();
    // Remove passwords before sending
    const usersWithoutPasswords = allUsers.map(user => ({
      id: user._id,
      name: user.name,
      email: user.email,
      picture: user.picture,
      provider: user.provider,
      googleId: user.googleId,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin
    }));
    res.json({ users: usersWithoutPasswords });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all inquiries (for admin - remove in production)
app.get('/api/admin/inquiries', async (req, res) => {
  try {
    res.json({ inquiries });
  } catch (error) {
    console.error('Get all inquiries error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Remove duplicate routes - using the ones defined earlier

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;