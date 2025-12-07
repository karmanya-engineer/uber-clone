# Quick Setup Guide

## Prerequisites Checklist

- [ ] Node.js (v16+) installed
- [ ] MongoDB running locally or MongoDB Atlas account
- [ ] Google Cloud account with Maps API key

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm run install:all
```

### 2. Set Up MongoDB

**Option A: Local MongoDB**
- Install MongoDB from https://www.mongodb.com/try/download/community
- Start MongoDB service: `mongod`

**Option B: MongoDB Atlas (Cloud)**
- Go to https://www.mongodb.com/cloud/atlas
- Create a free cluster
- Get your connection string

### 3. Get Google Maps API Key

1. Visit https://console.cloud.google.com/
2. Create a new project
3. Enable these APIs:
   - Maps JavaScript API
   - Places API
   - Distance Matrix API
4. Create API Key in Credentials
5. (Optional) Restrict API key for security

### 4. Configure Environment Variables

**Backend (.env file in `backend/` folder):**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/uber
JWT_SECRET=your-random-secret-key-here
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env.local file in `frontend/` folder):**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

### 5. Start the Application

**Option A: Run Both Together**
```bash
npm run dev
```

**Option B: Run Separately**

Terminal 1:
```bash
cd backend
npm run dev
```

Terminal 2:
```bash
cd frontend
npm run dev
```

### 6. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Test the Application

1. **Create a Passenger Account:**
   - Go to http://localhost:3000/login
   - Click "Sign Up"
   - Select "Passenger" role
   - Fill in details and register

2. **Create a Driver Account:**
   - Open an incognito/private window
   - Go to http://localhost:3000/login
   - Click "Sign Up"
   - Select "Driver" role
   - Fill in details and register

3. **Book a Ride:**
   - Login as passenger
   - Click "Book a Ride"
   - Enter pickup and dropoff locations
   - Confirm ride

4. **Accept a Ride:**
   - Login as driver
   - Turn on "Available"
   - Accept the pending ride
   - Start and complete the ride

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in backend/.env
- Try `mongosh` to test connection

### Google Maps Not Loading
- Verify API key is correct
- Check APIs are enabled in Google Cloud Console
- Look for errors in browser console (F12)

### Port Already in Use
- Change PORT in backend/.env
- Update NEXT_PUBLIC_API_URL in frontend/.env.local accordingly

### Module Not Found Errors
- Run `npm install` in root, backend, and frontend directories
- Delete node_modules and package-lock.json, then reinstall

## Common Issues

**Issue:** "Cannot find module"
- **Solution:** Run `npm install` in the specific directory

**Issue:** "MongoDB connection failed"
- **Solution:** Check MongoDB is running and connection string is correct

**Issue:** "Google Maps API error"
- **Solution:** Verify API key and enabled APIs in Google Cloud Console

**Issue:** "Socket.io connection failed"
- **Solution:** Ensure backend is running and FRONTEND_URL matches frontend URL

## Next Steps

- Customize the UI styling
- Add payment gateway integration
- Implement rating system
- Add push notifications
- Deploy to cloud platform

Happy coding! 🚗
