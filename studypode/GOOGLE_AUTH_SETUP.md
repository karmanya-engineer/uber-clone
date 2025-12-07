# Google OAuth and Email Verification Setup Guide

This guide will help you set up Google OAuth login and email verification for the Uber Clone application.

## Google OAuth Setup

### Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google+ API**:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google+ API"
   - Click "Enable"
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add authorized JavaScript origins:
     - `http://localhost:3000`
     - `http://localhost:5000`
   - Add authorized redirect URIs:
     - `http://localhost:5000/api/auth/google/callback`
   - Copy your **Client ID** and **Client Secret**

### Step 2: Configure Backend Environment Variables

Add the following to your `backend/.env` file:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
BACKEND_URL=http://localhost:5000
SESSION_SECRET=your-random-session-secret-key
```

## Email Verification Setup

### Option 1: Gmail (Recommended for Development)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Enable 2-Step Verification if not already enabled
   - Go to "App passwords"
   - Select "Mail" and "Other (Custom name)"
   - Enter "Uber Clone" as the name
   - Copy the generated 16-character password

3. **Configure Backend Environment Variables**:

Add to your `backend/.env` file:

```env
# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-character-app-password
```

### Option 2: Other Email Services

For other email services (Outlook, Yahoo, etc.), update the configuration:

```env
EMAIL_SERVICE=outlook  # or 'yahoo', 'hotmail', etc.
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-app-password
```

For custom SMTP servers:

Update `backend/utils/emailService.js` to use custom SMTP configuration:

```javascript
const transporter = nodemailer.createTransport({
  host: 'smtp.yourdomain.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});
```

## Complete Backend Environment Variables

Your complete `backend/.env` file should look like:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/uber
JWT_SECRET=your-secret-key-change-this-in-production
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password

# Session Secret
SESSION_SECRET=your-random-session-secret-key
```

## Frontend Configuration

No additional frontend environment variables are needed. The Google login button will automatically use the backend API URL from `NEXT_PUBLIC_API_URL`.

## Testing

### Test Google OAuth:

1. Start your backend server: `cd backend && npm run dev`
2. Start your frontend: `cd frontend && npm run dev`
3. Navigate to the login page
4. Click "Continue with Google"
5. Complete Google authentication
6. You should be redirected back to the app

### Test Email Verification:

1. Register a new account with a valid email
2. Check your email inbox for the verification email
3. Click the verification link
4. You should see a success message and be redirected to login

## Troubleshooting

### Google OAuth Issues:

- **"Error 400: redirect_uri_mismatch"**
  - Make sure the callback URL in Google Console matches exactly: `http://localhost:5000/api/auth/google/callback`
  - Check that `GOOGLE_CALLBACK_URL` in `.env` is correct

- **"Authentication failed"**
  - Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct
  - Check that Google+ API is enabled in Google Cloud Console

### Email Verification Issues:

- **Emails not sending:**
  - Verify `EMAIL_USER` and `EMAIL_PASSWORD` are correct
  - For Gmail, make sure you're using an App Password, not your regular password
  - Check spam folder

- **"Invalid credentials" error:**
  - For Gmail, ensure 2-Factor Authentication is enabled and you're using an App Password
  - Try regenerating the App Password

- **Verification link not working:**
  - Check that `FRONTEND_URL` in backend `.env` is correct
  - Verify the token hasn't expired (24 hours)

## Production Deployment

For production, update:

1. **Google OAuth**:
   - Add production URLs to authorized origins and redirect URIs
   - Use environment-specific Client ID and Secret

2. **Email Service**:
   - Use a production email service (SendGrid, Mailgun, AWS SES, etc.)
   - Update SMTP configuration accordingly

3. **Security**:
   - Use strong, random values for `JWT_SECRET` and `SESSION_SECRET`
   - Never commit `.env` files to version control

## Features

✅ **Google OAuth Login** - One-click authentication with Google
✅ **Email Verification** - Verify user email addresses
✅ **Automatic Verification** - Google users are automatically verified
✅ **Resend Verification** - Users can request new verification emails
✅ **Secure Tokens** - Time-limited verification tokens (24 hours)

## API Endpoints

- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/google/callback` - Google OAuth callback
- `GET /api/auth/verify-email/:token` - Verify email address
- `POST /api/auth/resend-verification` - Resend verification email

Enjoy secure authentication! 🚀
