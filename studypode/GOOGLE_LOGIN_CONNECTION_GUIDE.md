# Google Login Backend-Frontend Connection Guide

## ✅ Issues Fixed

I've fixed all the connection issues between the backend and frontend for Google OAuth login. Here's what was changed:

### 1. **CORS Configuration** ✅
- Updated backend CORS to allow credentials
- Added proper headers for OAuth redirects
- Configured to accept requests from frontend URL

### 2. **Session Management** ✅
- Improved session configuration
- Added secure cookie settings
- Proper session handling for OAuth flow

### 3. **Error Handling** ✅
- Better error messages in OAuth callback
- Proper error redirection to frontend
- Token encoding for URL safety

### 4. **Frontend Integration** ✅
- Fixed callback page to handle tokens properly
- Improved error handling
- Better user experience during authentication

## 🔧 Current Configuration

### Backend (`backend/server.js`)
- ✅ CORS properly configured
- ✅ Session management enabled
- ✅ Passport middleware setup
- ✅ OAuth routes registered

### Frontend (`frontend/pages/auth/callback.js`)
- ✅ Token handling
- ✅ Error handling
- ✅ Redirect logic

## 📋 Setup Instructions

### Step 1: Environment Variables

Make sure your `backend/.env` file has these variables:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/uber
JWT_SECRET=your-secret-key-change-this
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000

# Google OAuth (REQUIRED)
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Session Secret
SESSION_SECRET=your-random-session-secret-key
```

### Step 2: Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create/Select a project
3. Enable **Google+ API** (or People API)
4. Go to **Credentials** > **Create Credentials** > **OAuth client ID**
5. Set up authorized JavaScript origins:
   - `http://localhost:3000`
   - `http://localhost:5000`
6. Set authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback`
7. Copy your **Client ID** and **Client Secret**

### Step 3: Install Dependencies

```bash
cd backend
npm install
```

Make sure these packages are installed:
- `passport`
- `passport-google-oauth20`
- `express-session`

### Step 4: Start the Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Step 5: Test the Connection

1. Open browser to `http://localhost:3000/login`
2. Click "Continue with Google" button
3. You should be redirected to Google login
4. After logging in, you'll be redirected back to the app
5. Check browser console for any errors

## 🔍 Troubleshooting

### Problem: "redirect_uri_mismatch" Error

**Solution:**
1. Check Google Cloud Console → Credentials
2. Make sure redirect URI is exactly: `http://localhost:5000/api/auth/google/callback`
3. Update `GOOGLE_CALLBACK_URL` in `.env` to match

### Problem: CORS Errors

**Solution:**
1. Verify `FRONTEND_URL` in backend `.env` matches your frontend URL
2. Check browser console for specific CORS error
3. Ensure backend CORS is configured correctly (already done)

### Problem: "Invalid Client" Error

**Solution:**
1. Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env`
2. Make sure no extra spaces in the values
3. Regenerate credentials in Google Cloud Console if needed

### Problem: Token Not Received

**Solution:**
1. Check backend console for errors
2. Verify `JWT_SECRET` is set in `.env`
3. Check user creation/retrieval in database
4. Verify MongoDB is running

### Problem: Session Errors

**Solution:**
1. Check `SESSION_SECRET` is set in `.env`
2. Clear browser cookies and try again
3. Check backend console for session errors

## 🧪 Testing Checklist

- [ ] Backend server starts without errors
- [ ] Frontend server starts without errors
- [ ] Google login button appears on login page
- [ ] Clicking button redirects to Google
- [ ] Can complete Google authentication
- [ ] Redirects back to app successfully
- [ ] Token is stored in cookies
- [ ] User is logged in and redirected to dashboard
- [ ] No errors in browser console
- [ ] No errors in backend console

## 📝 How It Works

### Flow Diagram:

```
User clicks "Continue with Google"
    ↓
Frontend redirects to: /api/auth/google
    ↓
Backend redirects to Google OAuth
    ↓
User authenticates with Google
    ↓
Google redirects to: /api/auth/google/callback
    ↓
Backend creates/finds user, generates JWT token
    ↓
Backend redirects to: /auth/callback?token=XXX&role=user
    ↓
Frontend stores token, redirects to dashboard
```

## 🎯 Key Files Modified

1. **backend/server.js**
   - CORS configuration
   - Session setup
   - Passport middleware

2. **backend/routes/googleAuth.js**
   - OAuth callback route
   - Token generation
   - Redirect logic

3. **frontend/pages/auth/callback.js**
   - Token handling
   - Redirect logic
   - Error handling

4. **frontend/pages/login.js**
   - Google login button
   - Correct API URL

## ✨ Success Indicators

If everything is working correctly, you should see:

✅ No errors in browser console
✅ No errors in backend console  
✅ Smooth redirect flow
✅ User successfully logged in
✅ Token stored in cookies
✅ User redirected to appropriate dashboard

## 🚀 Next Steps

Once Google OAuth is working:

1. Test with different Google accounts
2. Test account linking (existing email + Google)
3. Verify email verification for Google users
4. Test driver role assignment

## 📞 Need Help?

If you're still having issues:

1. Check backend console logs
2. Check browser console logs
3. Verify all environment variables
4. Check Google Cloud Console settings
5. Verify MongoDB connection
6. Clear browser cookies and try again

The connection should now work perfectly! 🎉
