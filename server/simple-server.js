const express = require('express');
const path = require('path');

const app = express();
const PORT = 5001;

// Basic middleware
app.use(express.json());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '..', 'public')));

// Serve React src files for development
app.use('/src', express.static(path.join(__dirname, '..', 'src')));

// In-memory storage for demo
const inquiries = [];
let inquiryIdCounter = 1;

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
    environment: 'development'
  });
});

// Get all inquiries (for demo)
app.get('/api/admin/inquiries', (req, res) => {
  try {
    res.json({ inquiries });
  } catch (error) {
    console.error('Get all inquiries error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Basic PG data endpoint for frontend
app.get('/api/pgs', (req, res) => {
  res.json({
    pgs: [
      {
        id: 1,
        name: "Sunrise PG",
        location: "Near College Campus",
        price: 8000,
        rating: 4.5,
        amenities: ["WiFi", "Food", "Laundry"],
        image: "/images/pg1.jpg"
      },
      {
        id: 2,
        name: "Students Paradise",
        location: "Downtown Area",
        price: 6500,
        rating: 4.2,
        amenities: ["WiFi", "Food", "AC"],
        image: "/images/pg2.jpg"
      }
    ]
  });
});

// Serve React app for all non-API routes
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Simple PG Renter server running on port ${PORT}`);
  console.log(`📱 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`);
  console.log(`🌐 App: http://localhost:${PORT}`);
});

module.exports = app;