# PG Renter - Complete Application

A modern web application for PG (Paying Guest) rentals designed for college students, built with React.js and Node.js.

## 🎯 Features Completed

### 🎨 Modern UI Design
- ✅ Clean, modern design inspired by furniture website aesthetic
- ✅ Responsive layout for all devices
- ✅ Professional color scheme and typography
- ✅ Grid-based layouts and modern CSS

### 🔐 Authentication System
- ✅ Local email/password registration and login
- ✅ Google OAuth integration
- ✅ JWT-based authentication
- ✅ Secure password hashing with bcrypt
- ✅ Session management

### 🏠 PG Listings & Details
- ✅ Comprehensive PG listing display
- ✅ Detailed PG view with modal interface
- ✅ Property information, facilities, and testimonials
- ✅ Image galleries and location details
- ✅ Price and contact information

### 📧 Inquiry System
- ✅ User inquiry form for interested PGs
- ✅ Email notifications to PG owner (mayankkumar31k@gmail.com)
- ✅ HTML-formatted emails with user details
- ✅ Inquiry history for users
- ✅ Real-time inquiry tracking

### 👤 User Profile Management
- ✅ User profile viewing and editing
- ✅ Tab-based interface (Profile & Inquiries)
- ✅ Inquiry history with detailed tracking
- ✅ Account information management

### 🛠 Technical Implementation
- ✅ React.js frontend with modern hooks
- ✅ Node.js/Express.js backend API
- ✅ MongoDB integration (with fallback in-memory storage)
- ✅ Nodemailer for email functionality
- ✅ CORS configuration
- ✅ Environment variable management

## 🚀 Quick Start

### Development Mode
```bash
# Install dependencies
npm install

# Start development servers (both frontend and backend)
npm run dev
```

### Production Mode
```bash
# Build the application
npm run build

# Start production server
npm run production
```

## 📧 Email Configuration

To enable email functionality:

1. **Gmail Setup**:
   - Enable 2-Factor Authentication
   - Generate App Password in Google Account settings
   - Add credentials to `.env` file

2. **Environment Variables**:
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-gmail-app-password
   EMAIL_TO=mayankkumar31k@gmail.com
   ```

## 🔧 Configuration

Copy `.env.example` to `.env` and configure:
- Database connection (MongoDB)
- JWT secret key
- Google OAuth credentials
- Email settings
- Server port

## 📱 User Journey

1. **Landing Page**: Modern design with PG search functionality
2. **Registration**: Email or Google OAuth signup
3. **Browse PGs**: Filter and search available properties
4. **View Details**: Comprehensive PG information modal
5. **Submit Inquiry**: Authenticated users can express interest
6. **Track Inquiries**: View inquiry history in user profile
7. **Email Notification**: PG owner receives detailed inquiry emails

## 🎯 Production Ready Features

- ✅ Environment-based configuration
- ✅ Security best practices implemented
- ✅ Error handling and validation
- ✅ Responsive design for all devices
- ✅ Production deployment documentation
- ✅ Email notification system
- ✅ User authentication and authorization
- ✅ Data persistence and inquiry tracking

## 📧 Email Notifications

When a user submits an inquiry, the PG owner (mayankkumar31k@gmail.com) receives:

- Student contact information
- PG details they're interested in
- Personal message from student
- Student registration date
- Inquiry timestamp

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- CORS protection
- Secure environment variable management
- Google OAuth integration

## 📱 Responsive Design

- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interfaces
- Accessible navigation
- Modern CSS Grid and Flexbox

## 🎨 Design Highlights

- Clean, minimalist aesthetic
- Professional color palette
- Modern typography (system fonts)
- Subtle animations and transitions
- Card-based layouts
- Modal interfaces for detailed views

## 📞 Support

For technical questions or deployment assistance, refer to:
- `PRODUCTION_SETUP.md` for deployment guide
- `.env.example` for configuration reference
- Contact development team for custom modifications

---

**Status**: ✅ **Production Ready**  
**Last Updated**: January 2025  
**Version**: 1.0.0