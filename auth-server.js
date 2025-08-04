const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const connectDB = require('./server/config/database');
const User = require('./server/models/User');
const PG = require('./server/models/PG');
const Inquiry = require('./server/models/Inquiry');

const app = express();
const PORT = process.env.PORT || 5003;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: ['http://localhost:3004', 'http://localhost:3000', 'http://localhost:3005', 'http://localhost:3006', 'http://localhost:3007', 'http://localhost:8080'],
  credentials: true
}));
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key-change-in-production';

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    console.log('Registration request:', req.body);
    
    const { name, email, password, confirmPassword } = req.body;
    
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: 'All fields required' });
    }
    
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    
    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Create new user
    const user = new User({
      name,
      email: email.toLowerCase(),
      password
    });
    
    await user.save();
    
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    
    console.log('User registered:', email);
    
    res.status(201).json({ 
      token, 
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: messages.join('. ') });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('Login request:', req.body);
    
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    // Find user and include password for comparison
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    
    // Update last login
    user.lastLogin = new Date();
    await user.save();
    
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    
    console.log('User logged in:', email);
    
    res.json({ 
      token, 
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get PGs endpoint
app.get('/api/pgs', async (req, res) => {
  try {
    const { city, gender, minRent, maxRent, facilities } = req.query;
    
    let filter = { status: 'active' };
    
    if (city) {
      filter['location.city'] = new RegExp(city, 'i');
    }
    
    if (gender && gender !== 'any') {
      filter['accommodation.gender'] = { $in: [gender, 'mixed'] };
    }
    
    if (minRent || maxRent) {
      filter['pricing.rent'] = {};
      if (minRent) filter['pricing.rent'].$gte = parseInt(minRent);
      if (maxRent) filter['pricing.rent'].$lte = parseInt(maxRent);
    }
    
    if (facilities) {
      const facilityList = facilities.split(',');
      const facilityFilters = [];
      
      facilityList.forEach(facility => {
        const cleanFacility = facility.trim().toLowerCase().replace(' ', '_');
        facilityFilters.push({ [`facilities.basic.${cleanFacility}`]: true });
        facilityFilters.push({ [`facilities.amenities.${cleanFacility}`]: true });
        facilityFilters.push({ [`facilities.services.${cleanFacility}`]: true });
      });
      
      if (facilityFilters.length > 0) {
        filter.$or = facilityFilters;
      }
    }
    
    const pgs = await PG.find(filter)
      .populate('owner', 'name email phone')
      .sort({ 'features.isFeatured': -1, 'ratings.average': -1, createdAt: -1 })
      .limit(50);
    
    res.json(pgs);
  } catch (error) {
    console.error('Get PGs error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single PG endpoint
app.get('/api/pgs/:id', async (req, res) => {
  try {
    const pg = await PG.findById(req.params.id)
      .populate('owner', 'name email phone')
      .populate({
        path: 'reviews',
        populate: { path: 'user', select: 'name' }
      });
    
    if (!pg) {
      return res.status(404).json({ error: 'PG not found' });
    }
    
    res.json(pg);
  } catch (error) {
    console.error('Get PG error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Submit inquiry endpoint
app.post('/api/inquiries', async (req, res) => {
  try {
    const { pgId, name, email, phone, message, inquiryType, preferredVisitDate } = req.body;
    
    if (!pgId || !name || !email || !phone || !message) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }
    
    // Check if PG exists
    const pg = await PG.findById(pgId);
    if (!pg) {
      return res.status(404).json({ error: 'PG not found' });
    }
    
    // Find or create user
    let user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      user = new User({
        name,
        email: email.toLowerCase(),
        phone,
        password: 'temp-password-' + Date.now() // Temporary password for inquiry-only users
      });
      await user.save();
    }
    
    const inquiry = new Inquiry({
      user: user._id,
      pg: pgId,
      message,
      contactInfo: { name, email, phone },
      inquiryType: inquiryType || 'general',
      preferredVisitDate: preferredVisitDate || null
    });
    
    await inquiry.save();
    
    // Add inquiry to PG and User
    pg.inquiries.push(inquiry._id);
    user.inquiries.push(inquiry._id);
    
    await Promise.all([pg.save(), user.save()]);
    
    console.log('Inquiry submitted:', { pgId, email });
    
    res.status(201).json({ 
      message: 'Inquiry submitted successfully',
      inquiryId: inquiry._id
    });
    
  } catch (error) {
    console.error('Submit inquiry error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: messages.join('. ') });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// Health check
app.get('/api/health', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const pgCount = await PG.countDocuments();
    const inquiryCount = await Inquiry.countDocuments();
    res.json({ 
      status: 'OK', 
      database: 'connected',
      users: userCount,
      pgs: pgCount,
      inquiries: inquiryCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      database: 'disconnected',
      error: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Auth server running on port ${PORT}`);
  console.log(`📍 Health: http://localhost:${PORT}/api/health`);
});