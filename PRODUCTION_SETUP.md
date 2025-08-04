# PG Renter - Production Setup Guide

## Overview
Your PG Renter application is now fully functional with:
- User registration and authentication (local + Google OAuth)
- PG listings with detailed view
- Inquiry system with email notifications
- User profile management with inquiry history
- Modern, responsive design based on the furniture website reference

## Production Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/pgrenter
# OR for MongoDB Atlas (cloud):
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pgrenter

# JWT
JWT_SECRET=your-super-secret-jwt-key-here

# Google OAuth (get from Google Cloud Console)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email Configuration (for Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@pgrenter.com
EMAIL_TO=mayankkumar31k@gmail.com

# Server
PORT=5000
NODE_ENV=production
```

## Email Setup Instructions

### 1. Gmail App Password Setup
1. Go to your Google Account settings
2. Security → 2-Step Verification (enable if not already)
3. App passwords → Generate new app password
4. Use this password in EMAIL_PASS variable

### 2. Alternative Email Services
- **SendGrid**: For production email service
- **Mailgun**: For transactional emails
- **AWS SES**: For scalable email delivery

## Database Setup

### Option 1: Local MongoDB
```bash
# Install MongoDB
npm install -g mongodb-community

# Start MongoDB service
mongod --dbpath /data/db
```

### Option 2: MongoDB Atlas (Recommended for Production)
1. Create account at https://cloud.mongodb.com
2. Create new cluster
3. Get connection string
4. Add to MONGODB_URI in .env

## Deployment Options

### Option 1: Traditional VPS/Cloud Server
1. **Server Setup**:
   ```bash
   # Install Node.js 18+
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2 for process management
   npm install -g pm2
   ```

2. **Deploy Application**:
   ```bash
   # Clone/upload your code
   git clone your-repo-url
   cd pgRenter
   
   # Install dependencies
   npm install
   
   # Build React app
   npm run build
   
   # Start with PM2
   pm2 start server/server.js --name "pg-renter"
   pm2 startup
   pm2 save
   ```

3. **Nginx Configuration**:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       # Serve React app
       location / {
           root /path/to/pgRenter/build;
           try_files $uri $uri/ /index.html;
       }
       
       # API proxy
       location /api {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### Option 2: Heroku
1. **Prepare for Heroku**:
   ```bash
   # Add start script to package.json
   "scripts": {
     "start": "node server/server.js",
     "heroku-postbuild": "npm run build"
   }
   ```

2. **Deploy**:
   ```bash
   heroku create your-app-name
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your-secret
   # ... set all other env variables
   git push heroku main
   ```

### Option 3: Vercel/Netlify (Frontend) + Railway/Render (Backend)
- Deploy React app to Vercel/Netlify
- Deploy Node.js API to Railway/Render
- Update API URLs in frontend

## Security Checklist

### Backend Security
- [x] JWT tokens implemented
- [x] Password hashing with bcrypt
- [x] CORS configured
- [x] Input validation
- [ ] Rate limiting (add express-rate-limit)
- [ ] Helmet.js for security headers
- [ ] Environment variables for secrets

### Frontend Security
- [x] No hardcoded secrets
- [x] Secure authentication flow
- [x] Input sanitization
- [ ] HTTPS enforcement

## Performance Optimizations

### Backend
```javascript
// Add to server.js
const compression = require('compression');
app.use(compression());

// Add rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);
```

### Frontend
- [x] React build optimization
- [ ] Image optimization
- [ ] Lazy loading for components
- [ ] CDN for static assets

## Testing Instructions

### Local Testing
```bash
# Start development servers
npm run dev

# Test endpoints
curl http://localhost:5000/api/health
```

### Production Testing
1. Test user registration
2. Test Google OAuth login
3. Test PG inquiry submission
4. Verify email delivery
5. Test inquiry history

## Monitoring and Maintenance

### Logging
```javascript
// Add to server.js
const winston = require('winston');
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### Health Monitoring
- Set up uptime monitoring (UptimeRobot, Pingdom)
- Database backup strategy
- Error tracking (Sentry)

## Troubleshooting

### Common Issues
1. **Email not sending**: Check Gmail app password and 2FA
2. **Database connection**: Verify MongoDB URI and network access
3. **Google OAuth**: Check redirect URIs in Google Console
4. **CORS errors**: Verify frontend/backend URLs

### Debug Commands
```bash
# Check logs
pm2 logs pg-renter

# Monitor processes
pm2 monit

# Restart application
pm2 restart pg-renter
```

## Support
For deployment help, contact your development team or check:
- MongoDB documentation
- Express.js deployment guides
- React deployment guides
- Cloud provider documentation