# Quick Start Guide

## 🚀 Get Up and Running in 5 Minutes

### Step 1: Install Dependencies
```bash
npm run install:all
```

### Step 2: Set Up MongoDB
**Option A: Local MongoDB**
- Start MongoDB: `mongod`

**Option B: MongoDB Atlas**
- Use connection string in `.env`

### Step 3: Get Google Maps API Key
1. Go to https://console.cloud.google.com/
2. Enable: Maps JavaScript API, Places API, Distance Matrix API
3. Create API Key

### Step 4: Create Environment Files

**Backend (`backend/.env`):**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/uber
JWT_SECRET=change-this-secret
GOOGLE_MAPS_API_KEY=your-api-key-here
FRONTEND_URL=http://localhost:3000
```

**Frontend (`frontend/.env.local`):**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-api-key-here
```

### Step 5: Run the Application
```bash
npm run dev
```

### Step 6: Test It!
1. Open http://localhost:3000
2. Register as Passenger
3. Open incognito window → Register as Driver
4. Book a ride as passenger
5. Accept as driver

## 🎯 Key URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Login**: http://localhost:3000/login
- **Driver Dashboard**: http://localhost:3000/driver

## 📝 Test Accounts

Create accounts through the register page:
- **Passenger**: Select "Passenger" role
- **Driver**: Select "Driver" role

## 🔧 Troubleshooting

**MongoDB Error?**
- Make sure MongoDB is running
- Check connection string in `.env`

**Google Maps Not Loading?**
- Verify API key is correct
- Check APIs are enabled in Google Cloud Console

**Port Already in Use?**
- Change PORT in backend `.env`
- Update NEXT_PUBLIC_API_URL in frontend `.env.local`

## ✅ What's Included

- ✅ User Authentication (JWT)
- ✅ Ride Booking System
- ✅ Real-time Location Tracking
- ✅ Google Maps Integration
- ✅ Driver Dashboard
- ✅ Passenger Dashboard
- ✅ Socket.io Real-time Updates
- ✅ Fare Calculation

Ready to go! 🚗
