import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { isAuthenticated } from '../lib/auth';
import { rides, users } from '../lib/api';
import io from 'socket.io-client';

const MapComponent = dynamic(() => import('../components/DriverMap'), {
  ssr: false,
});

export default function DriverDashboard() {
  const router = useRouter();
  const [availableRides, setAvailableRides] = useState([]);
  const [currentRide, setCurrentRide] = useState(null);
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    users.getMe()
      .then(res => {
        if (res.data.role !== 'driver') {
          router.push('/');
          return;
        }
        setIsAvailable(res.data.isAvailable);
        fetchAvailableRides();
      })
      .catch(() => router.push('/login'));
  }, [router]);

  // Socket.io for real-time ride updates
  useEffect(() => {
    if (!isAvailable) return;

    const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000');
    
    socket.on('new-ride', (ride) => {
      setAvailableRides(prev => [ride, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, [isAvailable]);

  const fetchAvailableRides = () => {
    rides.getAvailable()
      .then(res => setAvailableRides(res.data))
      .catch(err => console.error(err));
  };

  const handleToggleAvailability = () => {
    const newStatus = !isAvailable;
    users.updateAvailability(newStatus)
      .then(() => {
        setIsAvailable(newStatus);
        if (newStatus) {
          fetchAvailableRides();
        }
      })
      .catch(err => console.error(err));
  };

  const handleAcceptRide = (rideId) => {
    rides.accept(rideId)
      .then(res => {
        setCurrentRide(res.data);
        setAvailableRides(availableRides.filter(r => r._id !== rideId));
      })
      .catch(err => alert(err.response?.data?.message || 'Failed to accept ride'));
  };

  const handleStartRide = () => {
    rides.start(currentRide._id)
      .then(res => setCurrentRide(res.data))
      .catch(err => alert(err.response?.data?.message || 'Failed to start ride'));
  };

  const handleCompleteRide = () => {
    rides.complete(currentRide._id)
      .then(() => {
        setCurrentRide(null);
        fetchAvailableRides();
      })
      .catch(err => alert(err.response?.data?.message || 'Failed to complete ride'));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-black text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Driver Dashboard</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={handleToggleAvailability}
            className={`px-4 py-2 rounded font-semibold ${
              isAvailable ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'
            }`}
          >
            {isAvailable ? 'Available' : 'Unavailable'}
          </button>
          <button
            onClick={() => {
              require('../lib/auth').removeAuthToken();
              router.push('/login');
            }}
            className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="flex">
        <div className="w-1/3 p-4 space-y-4">
          {!currentRide && (
            <div>
              <h2 className="text-xl font-bold mb-4">Available Rides</h2>
              {!isAvailable && (
                <p className="text-gray-600 mb-4">Turn on availability to see rides</p>
              )}
              {availableRides.length === 0 && isAvailable && (
                <p className="text-gray-600">No available rides at the moment</p>
              )}
              {availableRides.map((ride) => (
                <div key={ride._id} className="bg-white p-4 rounded-lg shadow mb-4">
                  <p className="font-semibold">From: {ride.pickupLocation?.address}</p>
                  <p className="font-semibold">To: {ride.dropoffLocation?.address}</p>
                  <p className="text-green-600 font-bold">${ride.fare?.toFixed(2)}</p>
                  <button
                    onClick={() => handleAcceptRide(ride._id)}
                    className="mt-2 w-full bg-black text-white py-2 rounded hover:bg-gray-800"
                  >
                    Accept Ride
                  </button>
                </div>
              ))}
            </div>
          )}

          {currentRide && (
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Current Ride</h2>
              <p className="mb-2"><strong>Status:</strong> {currentRide.status}</p>
              <p className="mb-2"><strong>From:</strong> {currentRide.pickupLocation?.address}</p>
              <p className="mb-2"><strong>To:</strong> {currentRide.dropoffLocation?.address}</p>
              <p className="mb-2"><strong>Fare:</strong> ${currentRide.fare?.toFixed(2)}</p>
              
              {currentRide.status === 'driver-assigned' && (
                <button
                  onClick={handleStartRide}
                  className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  Start Ride
                </button>
              )}
              
              {currentRide.status === 'in-progress' && (
                <button
                  onClick={handleCompleteRide}
                  className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                >
                  Complete Ride
                </button>
              )}
            </div>
          )}
        </div>

        <div className="w-2/3">
          <MapComponent currentRide={currentRide} />
        </div>
      </div>
    </div>
  );
}
