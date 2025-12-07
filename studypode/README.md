# Uber Clone - Complete Ride-Sharing Application

A full-stack Uber-like application with frontend (Next.js/React), backend (Node.js/Express), and Google Maps integration.

## Features

- 🚗 **Ride Booking**: Passengers can book rides with pickup and dropoff locations
- 📍 **Google Maps Integration**: Real-time map visualization with routes and markers
- 👤 **User Authentication**: Register/Login for both passengers and drivers
- 🔐 **Google OAuth Login**: One-click authentication with Google account
- ✉️ **Email Verification**: Email verification system for new user registrations
- 🚕 **Driver Dashboard**: Drivers can accept, start, and complete rides
- 📡 **Real-time Updates**: Socket.io for live location tracking and ride status updates
- 💰 **Fare Calculation**: Automatic fare calculation based on distance and time
- 🎨 **Modern UI**: Beautiful, responsive interface built with Tailwind CSS
- 📄 **HTML Pages**: Standalone HTML pages (landing, login, about, features) for easy access

## Tech Stack

### Frontend
- Next.js 14
- React 18
- Tailwind CSS
- Google Maps API
- Socket.io Client
- Axios
- Standalone HTML pages (public directory)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Socket.io
- JWT Authentication
- Bcrypt for password hashing

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Google Maps API Key

## Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd studypode
```

### 2. Install Dependencies

Install all dependencies for root, backend, and frontend:

```bash
npm run install:all
```

Or install manually:

```bash
# Root dependencies
npm install

# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

### 3. Set Up Environment Variables

#### Backend (.env file in backend folder)

Create `backend/.env` file:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/uber
JWT_SECRET=your-secret-key-change-this-in-production
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
FRONTEND_URL=http://localhost:3000
```

#### Frontend (.env.local file in frontend folder)

Create `frontend/.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

### 4. Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API
   - Distance Matrix API
4. Create credentials (API Key)
5. Add the API key to both backend and frontend `.env` files

### 5. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas connection string in MONGODB_URI
```

### 6. Run the Application

#### Option 1: Run Both Frontend and Backend Together

```bash
npm run dev
```

#### Option 2: Run Separately

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

### 7. Access the Application

- **Frontend (Next.js)**: http://localhost:3000
- **HTML Landing Page**: http://localhost:3000/index.html
- **HTML Login Page**: http://localhost:3000/login.html
- **Backend API**: http://localhost:5000

## Usage

### For Passengers

1. Register/Login as a **Passenger** (or select "Passenger" role)
2. On the home page, click "Book a Ride"
3. Enter pickup and dropoff locations (use autocomplete or current location)
4. Confirm your ride
5. Wait for a driver to accept
6. Track your driver's location in real-time
7. Complete the ride when you arrive

### For Drivers

1. Register/Login as a **Driver** (select "Driver" role)
2. Go to the Driver Dashboard
3. Turn on "Available" to receive ride requests
4. Accept available rides
5. Navigate to pickup location
6. Start the ride when passenger is picked up
7. Complete the ride at dropoff location

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user (sends verification email)
- `POST /api/auth/login` - Login user
- `GET /api/auth/google` - Initiate Google OAuth login
- `GET /api/auth/google/callback` - Google OAuth callback
- `GET /api/auth/verify-email/:token` - Verify email address
- `POST /api/auth/resend-verification` - Resend verification email

### Rides
- `POST /api/rides` - Create a new ride
- `GET /api/rides` - Get user's rides
- `GET /api/rides/available` - Get available rides (drivers only)
- `POST /api/rides/:id/accept` - Accept a ride (drivers only)
- `POST /api/rides/:id/start` - Start a ride
- `POST /api/rides/:id/complete` - Complete a ride
- `POST /api/rides/:id/cancel` - Cancel a ride
- `POST /api/rides/:id/location` - Update driver location

### Users
- `GET /api/users/me` - Get current user
- `PUT /api/users/location` - Update user location
- `PUT /api/users/availability` - Update driver availability
- `GET /api/users/drivers` - Get nearby drivers

## Project Structure

```
studypode/
├── backend/
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Authentication middleware
│   └── server.js        # Express server
├── frontend/
│   ├── components/      # React components
│   ├── pages/           # Next.js pages
│   ├── public/          # Static HTML pages
│   │   ├── index.html   # Landing page
│   │   ├── login.html   # Login/Register page
│   │   ├── about.html   # About page
│   │   └── features.html # Features page
│   ├── lib/             # API utilities
│   └── styles/          # CSS styles
└── README.md
```

## Features in Detail

### Real-time Location Tracking
- Uses Socket.io for real-time communication
- Drivers' locations are updated continuously
- Passengers can see driver location on map

### Fare Calculation
- Calculates fare based on distance and time
- Uses Google Distance Matrix API for accurate calculations
- Falls back to simplified calculation if API fails

### User Roles
- **Passenger**: Book and track rides
- **Driver**: Accept and complete rides

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check MONGODB_URI in backend/.env
- Try using MongoDB Atlas if local installation fails

### Google Maps Not Loading
- Verify Google Maps API key is correct
- Ensure required APIs are enabled in Google Cloud Console
- Check browser console for API errors

### Socket.io Connection Issues
- Ensure backend server is running
- Check FRONTEND_URL in backend/.env matches frontend URL
- Verify CORS settings

## Development Notes

- The application uses JWT for authentication
- Passwords are hashed using bcrypt
- Real-time updates use Socket.io
- Google Maps API requires billing enabled (free tier available)

## HTML Pages

The project includes standalone HTML pages in the `frontend/public/` directory:

- **index.html** - Beautiful landing page with features and call-to-action
- **login.html** - Login and registration form with API integration
- **about.html** - About page with mission and technology information
- **features.html** - Detailed features page for passengers and drivers

These pages can be accessed directly at:
- `http://localhost:3000/index.html`
- `http://localhost:3000/login.html`
- `http://localhost:3000/about.html`
- `http://localhost:3000/features.html`

The HTML pages work independently and connect to the backend API for authentication. See `frontend/public/README.md` for more details.

## License

MIT License

## Contributing

Feel free to submit issues and enhancement requests!

## Support

For issues or questions, please open an issue on GitHub.
