# Google OAuth Connection Fix

## Issues Fixed

### 1. CORS Configuration
- Updated CORS to allow credentials and proper headers
- Added support for OAuth redirects

### 2. Session Configuration
- Improved session management with proper cookie settings
- Added secure cookie support for production

### 3. Error Handling
- Better error messages in OAuth callback
- Proper error redirection to frontend
- Token encoding for URL safety

### 4. Frontend-Backend Connection
- Fixed callback redirect URLs
- Improved error handling in callback page
- Dynamic API URL configuration

## Testing the Connection

### Step 1: Verify Backend is Running
```bash
cd backend
npm run dev
```

Check console for:
- "MongoDB connected"
- "Server running on port 5000"

### Step 2: Verify Frontend is Running
```bash
cd frontend
npm run dev
```

Check console for:
- "Ready on http://localhost:3000"

### Step 3: Test Google OAuth Flow

1. **Go to Login Page**
   - Navigate to `http://localhost:3000/login`
   - Or `http://localhost:3000/login.html`

2. **Click "Continue with Google"**
   - Should redirect to Google login page

3. **Complete Google Authentication**
   - Sign in with Google account
   - Grant permissions

4. **Verify Redirect**
   - Should redirect back to `/auth/callback`
   - Then automatically redirect to dashboard
   - Check browser console for any errors

### Step 4: Check Environment Variables

Make sure `backend/.env` has:
```env
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

## Troubleshooting

### Issue: Redirect to wrong URL
**Solution**: Check `GOOGLE_CALLBACK_URL` in backend `.env` matches Google Cloud Console settings

### Issue: CORS errors
**Solution**: Verify `FRONTEND_URL` in backend `.env` matches your frontend URL

### Issue: Session errors
**Solution**: Check `SESSION_SECRET` is set in backend `.env`

### Issue: "auth_failed" error
**Solution**: 
- Verify Google OAuth credentials are correct
- Check callback URL in Google Cloud Console
- Ensure Google+ API is enabled

### Issue: Token not received
**Solution**:
- Check backend console for errors
- Verify JWT_SECRET is set
- Check user is being created/retrieved correctly

## Debug Mode

Add console logs to track the flow:

1. **Backend** - Check `backend/routes/googleAuth.js` logs
2. **Frontend** - Check browser console
3. **Network** - Check browser Network tab for redirects

## Common Errors

### "redirect_uri_mismatch"
- The callback URL in Google Console doesn't match
- Update Google Console: `http://localhost:5000/api/auth/google/callback`
- Update `.env`: `GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback`

### "invalid_client"
- Google Client ID or Secret is wrong
- Verify in Google Cloud Console
- Check `.env` file

### "access_denied"
- User cancelled Google login
- Normal behavior, user can try again

## Success Indicators

✅ Google login button appears on login page
✅ Clicking redirects to Google
✅ After Google login, redirects back to app
✅ Token is stored in cookies
✅ User is logged in and redirected to dashboard

If all these work, the connection is successful! 🎉
