const express = require('express');
const path = require('path');

const app = express();
const PORT = 4000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/src', express.static(path.join(__dirname, 'src')));

// Proxy API calls to backend
app.use('/api', (req, res) => {
  const backendUrl = `http://localhost:5001${req.path}`;
  console.log(`Proxying ${req.method} ${req.path} to ${backendUrl}`);
  
  const options = {
    method: req.method,
    headers: {
      'Content-Type': 'application/json',
      ...req.headers
    }
  };

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    options.body = JSON.stringify(req.body);
  }

  fetch(backendUrl, options)
    .then(response => response.json())
    .then(data => res.json(data))
    .catch(error => {
      console.error('Proxy error:', error);
      res.status(500).json({ error: 'Proxy error' });
    });
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Development server running on port ${PORT}`);
  console.log(`🌐 Frontend: http://localhost:${PORT}`);
  console.log(`📡 Backend API: http://localhost:5001`);
});