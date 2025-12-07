# Uber Clone Project Summary

## Overview
A complete, full-stack ride-sharing application similar to Uber, with real-time location tracking, ride booking, and driver management.

## Architecture

### Frontend (Next.js + React)
- **Location**: `frontend/` directory
- **Framework**: Next.js 14 with React 18
- **Styling**: Tailwind CSS
- **Maps**: Google Maps API with @react-google-maps/api
- **Real-time**: Socket.io Client
- **HTTP Client**: Axios

### Backend (Node.js + Express)
- **Location**: `backend/` directory
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time**: Socket.io Server
- **Password Hashing**: Bcrypt

## Key Features

### For Passengers
1. User registration and authentication
2. Interactive Google Maps interface
3. Pickup/dropoff location selection with autocomplete
4. Real-time ride booking
5. Live driver location tracking
6. Ride status updates (pending, accepted, in-progress, completed)
7. Fare calculation and display

### For Drivers
1. Driver registration with vehicle information
2. Availability toggle (available/unavailable)
3. Real-time ride requests
4. Ride acceptance
5. Navigation to pickup and dropoff locations
6. Ride start/complete functionality
7. Location tracking and updates

## File Structure

```
studypode/
├── backend/
│   ├── models/
│   │   ├── User.js          # User schema (passenger/driver)
│   │   └── Ride.js          # Ride schema
│   ├── routes/
│   │   ├── auth.js          # Authentication routes
│   │   ├── rides.js         # Ride management routes
│   │   └── users.js         # User management routes
│   ├── middleware/
│   │   └── auth.js          # JWT authentication middleware
│   ├── server.js            # Express server with Socket.io
│   └── package.json
│
├── frontend/
│   ├── components/
│   │   ├── Map.js           # Passenger map with booking
│   │   └── DriverMap.js     # Driver map with navigation
│   ├── pages/
│   │   ├── index.js         # Passenger dashboard
│   │   ├── driver.js        # Driver dashboard
│   │   ├── login.js         # Login/Register page
│   │   └── _app.js          # App wrapper with auth check
│   ├── lib/
│   │   ├── api.js           # API client with Axios
│   │   └── auth.js          # Auth utilities
│   ├── styles/
│   │   └── globals.css      # Global styles
│   └── package.json
│
├── README.md                # Main documentation
├── SETUP.md                 # Quick setup guide
└── package.json             # Root package.json
```

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user (passenger or driver)
- `POST /login` - Login user

### Rides (`/api/rides`)
- `POST /` - Create a new ride (passenger)
- `GET /` - Get user's rides
- `GET /available` - Get available rides (drivers only)
- `POST /:id/accept` - Accept a ride (driver)
- `POST /:id/start` - Start a ride (driver)
- `POST /:id/complete` - Complete a ride (driver)
- `POST /:id/cancel` - Cancel a ride
- `POST /:id/location` - Update driver location

### Users (`/api/users`)
- `GET /me` - Get current user profile
- `PUT /location` - Update user location
- `PUT /availability` - Update driver availability
- `GET /drivers` - Get nearby available drivers

## Real-time Events (Socket.io)

### Server Emits:
- `new-ride` - New ride available for drivers
- `ride-accepted` - Ride has been accepted by driver
- `ride-started` - Ride has started
- `ride-completed` - Ride has been completed
- `ride-cancelled` - Ride has been cancelled
- `driver-location-update` - Driver location update

### Client Emits:
- `join-ride` - Join a ride room for updates
- `driver-location` - Send driver location update

## Database Models

### User Model
- Basic info: name, email, password, phone
- Role: 'user' (passenger) or 'driver'
- Driver-specific: vehicleInfo, isAvailable, rating, totalRides
- Location: lat, lng (for drivers)

### Ride Model
- Passenger and Driver references
- Pickup and Dropoff locations (address, lat, lng)
- Status: pending, accepted, driver-assigned, in-progress, completed, cancelled
- Fare calculation: fare, distance, duration
- Payment method: cash or card
- Rating and review (optional)

## Fare Calculation

The fare is calculated using:
- Base fare: $2.50
- Per kilometer: $1.50/km
- Per minute: $0.30/min

Uses Google Distance Matrix API for accurate distance and time calculations, with fallback calculation if API fails.

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Protected API routes with authentication middleware
- CORS configuration
- Environment variables for sensitive data

## Technologies Used

### Frontend
- Next.js 14
- React 18
- Tailwind CSS
- Google Maps JavaScript API
- Socket.io Client
- Axios
- js-cookie

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Socket.io
- JWT
- Bcrypt
- Axios (for Google Maps API calls)

## Getting Started

See `SETUP.md` for detailed setup instructions or `README.md` for comprehensive documentation.

## Environment Variables Required

### Backend
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `GOOGLE_MAPS_API_KEY` - Google Maps API key
- `FRONTEND_URL` - Frontend URL for CORS

### Frontend
- `NEXT_PUBLIC_API_URL` - Backend API URL
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - Google Maps API key

## Future Enhancements

- Payment gateway integration (Stripe, PayPal)
- Push notifications
- Rating and review system
- Ride history and receipts
- Multiple vehicle types (UberX, UberXL, etc.)
- Estimated time of arrival (ETA)
- Driver earnings dashboard
- Passenger favorite locations
- Split fare feature
- In-app chat between driver and passenger

## Notes

- Google Maps API requires billing to be enabled (free tier available)
- MongoDB can be local or cloud (MongoDB Atlas)
- All location data requires user permission
- Real-time features require active Socket.io connection
