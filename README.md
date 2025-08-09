# PG Renter - Next.js Application

A modern PG accommodation finder built with Next.js 15, TypeScript, and Tailwind CSS. Find verified student accommodations with advanced filtering, real-time search, and secure authentication.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB connection (configured in `.env.local`)

### Installation & Running

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start both servers:**
   ```bash
   # On Windows
   start-both.bat
   
   # Or manually:
   # Terminal 1 - Start auth server
   npm run server
   
   # Terminal 2 - Start Next.js
   npm run dev
   ```

3. **Access the application:**
   - Frontend: http://localhost:3000
   - API: http://localhost:5001

## 📁 Project Structure

```
pgRenter/
├── src/
│   ├── app/                 # App Router pages
│   │   ├── page.tsx        # Home page
│   │   ├── browse/         # PG listing page
│   │   ├── pg/[id]/        # Dynamic PG detail page
│   │   ├── layout.tsx      # Root layout
│   │   └── globals.css     # Global styles
│   ├── components/         # Reusable components
│   │   ├── ui/            # UI components
│   │   ├── Login.tsx      # Login modal
│   │   └── Register.tsx   # Registration modal
│   ├── hooks/             # Custom hooks
│   ├── lib/               # Utilities
│   └── data/              # Sample data & types
├── .env.local             # Environment variables
├── next.config.js         # Next.js configuration
├── tailwind.config.js     # Tailwind CSS config
└── package.json           # Dependencies & scripts
```

## 🔄 Migration Changes

### From React.js to Next.js:
- **Routing**: React Router → Next.js App Router
- **State Management**: Client-side only → Server/Client components
- **Environment Variables**: `REACT_APP_*` → `NEXT_PUBLIC_*`
- **Image Optimization**: `<img>` → Next.js `<Image>`
- **File Structure**: `/src` → `/src/app` (App Router)
- **TypeScript**: Enhanced with proper types

### Key Features Migrated:
- ✅ Landing page with hero section
- ✅ PG browsing with filters
- ✅ Dynamic PG detail pages
- ✅ Authentication (Login/Register)
- ✅ Google OAuth integration
- ✅ Responsive design
- ✅ API integration with external auth server

## 🔧 Environment Variables

Create `.env.local` file:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# API
NEXT_PUBLIC_API_URL=http://localhost:5001
```

## 🌐 Available Routes

- `/` - Home page
- `/browse` - Browse all PGs with filters
- `/pg/[id]` - Individual PG details
- `/about` - About page (placeholder)
- `/contact` - Contact page (placeholder)

## 🔑 Authentication

The app uses JWT-based authentication with:
- Email/password registration & login
- Google OAuth integration
- Persistent sessions via localStorage
- Protected routes support

## 📱 Responsive Design

- Mobile-first approach
- Tailwind CSS for styling
- Optimized for all screen sizes
- Touch-friendly interface

## 🎯 Performance Optimizations

- Next.js Image optimization
- Automatic code splitting
- Static generation where possible
- Optimized bundle size

## 🚀 Production Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

For deployment platforms like Vercel, Netlify, or similar:
1. Connect your repository
2. Set environment variables
3. Deploy automatically

## 📊 API Integration

The app integrates with the existing Express.js authentication server:
- User registration & login
- PG listings from MongoDB
- Inquiry submissions
- Google OAuth handling

## 🔮 Future Enhancements

- Server-side rendering for better SEO
- API routes for backend functionality
- Advanced filtering & search
- Real-time chat integration
- Payment processing
- Admin dashboard

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit pull request

## 📄 License

This project is licensed under the MIT License.