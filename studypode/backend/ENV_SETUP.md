# Environment Variables Setup

Create a `.env` file in the `backend` directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/studypode

# JWT Secret (Change this in production!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Frontend & Backend URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000

# Google OAuth Configuration
# Get these from: https://console.cloud.google.com/
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Google Maps API (Optional - for ride distance calculations)
GOOGLE_MAPS_API_KEY=your-google-maps-api-key-here

# Email Configuration (Optional - for email verification)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password

# Session Secret (Change this in production!)
SESSION_SECRET=your-random-session-secret-key-change-this-in-production
```

## Required Variables

- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `FRONTEND_URL` - Frontend application URL
- `BACKEND_URL` - Backend API URL
- `GOOGLE_CLIENT_ID` - Google OAuth Client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth Client Secret
- `GOOGLE_CALLBACK_URL` - Google OAuth callback URL
- `SESSION_SECRET` - Secret for session management

## Optional Variables

- `GOOGLE_MAPS_API_KEY` - For calculating ride distances (has fallback)
- `EMAIL_SERVICE` - Email service provider (default: gmail)
- `EMAIL_USER` - Email address for sending verification emails
- `EMAIL_PASSWORD` - App-specific password for email service

