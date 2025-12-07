import { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { rides, users } from '../lib/api';
import io from 'socket.io-client';

const containerStyle = {
  width: '100%',
  height: 'calc(100vh - 80px)',
};

const libraries = ['places'];

export default function MapComponent() {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [pickupLocation, setPickupLocation] = useState(null);
  const [dropoffLocation, setDropoffLocation] = useState(null);
  const [directions, setDirections] = useState(null);
  const [activeRide, setActiveRide] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropoffAddress, setDropoffAddress] = useState('');
  const [showBooking, setShowBooking] = useState(false);
  const [rideStatus, setRideStatus] = useState(null);
  const mapRef = useRef(null);
  const socketRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentPosition(pos);
          setPickupLocation(pos);
          users.updateLocation(pos);
        },
        () => {
          // Default to New York if geolocation fails
          const defaultPos = { lat: 40.7128, lng: -74.0060 };
          setCurrentPosition(defaultPos);
          setPickupLocation(defaultPos);
        }
      );
    }
  }, []);

  // Connect to socket for real-time updates
  useEffect(() => {
    if (activeRide) {
      socketRef.current = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000');
      socketRef.current.emit('join-ride', activeRide._id);

      socketRef.current.on('driver-location-update', (data) => {
        setDriverLocation({ lat: data.lat, lng: data.lng });
      });

      socketRef.current.on('ride-accepted', (ride) => {
        setActiveRide(ride);
        setRideStatus(ride.status);
      });

      socketRef.current.on('ride-started', (ride) => {
        setActiveRide(ride);
        setRideStatus(ride.status);
      });

      socketRef.current.on('ride-completed', (ride) => {
        setActiveRide(null);
        setRideStatus(null);
        setDirections(null);
        setPickupLocation(null);
        setDropoffLocation(null);
        setPickupAddress('');
        setDropoffAddress('');
      });

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
      };
    }
  }, [activeRide]);

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
    
    // Initialize autocomplete for pickup
    const pickupInput = document.getElementById('pickup-input');
    const dropoffInput = document.getElementById('dropoff-input');
    
    if (window.google && pickupInput) {
      const pickupAutocomplete = new window.google.maps.places.Autocomplete(pickupInput);
      pickupAutocomplete.addListener('place_changed', () => {
        const place = pickupAutocomplete.getPlace();
        if (place.geometry) {
          const location = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          };
          setPickupLocation(location);
          setPickupAddress(place.formatted_address);
        }
      });
    }

    if (window.google && dropoffInput) {
      const dropoffAutocomplete = new window.google.maps.places.Autocomplete(dropoffInput);
      dropoffAutocomplete.addListener('place_changed', () => {
        const place = dropoffAutocomplete.getPlace();
        if (place.geometry) {
          const location = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          };
          setDropoffLocation(location);
          setDropoffAddress(place.formatted_address);
        }
      });
    }
  }, []);

  const calculateRoute = useCallback(() => {
    if (!pickupLocation || !dropoffLocation || !mapRef.current) return;

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: pickupLocation,
        destination: dropoffLocation,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === 'OK' && result) {
          setDirections(result);
        }
      }
    );
  }, [pickupLocation, dropoffLocation]);

  useEffect(() => {
    if (pickupLocation && dropoffLocation && isLoaded) {
      calculateRoute();
    }
  }, [pickupLocation, dropoffLocation, isLoaded, calculateRoute]);

  const handleBookRide = async () => {
    if (!pickupLocation || !dropoffLocation) {
      alert('Please select both pickup and dropoff locations');
      return;
    }

    try {
      const rideData = {
        pickupLocation: {
          ...pickupLocation,
          address: pickupAddress,
        },
        dropoffLocation: {
          ...dropoffLocation,
          address: dropoffAddress,
        },
        paymentMethod: 'card',
      };

      const response = await rides.create(rideData);
      setActiveRide(response.data);
      setRideStatus('pending');
      setShowBooking(false);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to book ride');
    }
  };

  const handleCancelRide = async () => {
    if (!activeRide) return;
    try {
      await rides.cancel(activeRide._id);
      setActiveRide(null);
      setRideStatus(null);
      setDirections(null);
      setPickupLocation(currentPosition);
      setDropoffLocation(null);
      setPickupAddress('');
      setDropoffAddress('');
      setDriverLocation(null);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to cancel ride');
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading Google Maps...</div>
      </div>
    );
  }

  return (
    <div className="relative">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={currentPosition || { lat: 40.7128, lng: -74.0060 }}
        zoom={13}
        onLoad={onMapLoad}
      >
        {pickupLocation && (
          <Marker
            position={pickupLocation}
            label="P"
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: '#00D9A5',
              fillOpacity: 1,
              strokeWeight: 2,
              strokeColor: '#ffffff',
            }}
          />
        )}

        {dropoffLocation && (
          <Marker
            position={dropoffLocation}
            label="D"
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: '#FF0000',
              fillOpacity: 1,
              strokeWeight: 2,
              strokeColor: '#ffffff',
            }}
          />
        )}

        {driverLocation && (
          <Marker
            position={driverLocation}
            label="🚗"
            icon={{
              url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            }}
          />
        )}

        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>

      {/* Booking Panel */}
      {!activeRide && (
        <div className="absolute top-4 left-4 right-4 bg-white p-4 rounded-lg shadow-lg max-w-md">
          <button
            onClick={() => setShowBooking(!showBooking)}
            className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
          >
            {showBooking ? 'Hide' : 'Book a Ride'}
          </button>

          {showBooking && (
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Pickup Location</label>
                <input
                  id="pickup-input"
                  type="text"
                  placeholder="Enter pickup address"
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
                <button
                  onClick={() => {
                    if (currentPosition) {
                      setPickupLocation(currentPosition);
                      setPickupAddress('Current Location');
                    }
                  }}
                  className="mt-2 text-sm text-blue-600 hover:underline"
                >
                  Use Current Location
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Dropoff Location</label>
                <input
                  id="dropoff-input"
                  type="text"
                  placeholder="Enter dropoff address"
                  value={dropoffAddress}
                  onChange={(e) => setDropoffAddress(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <button
                onClick={handleBookRide}
                className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
              >
                Confirm Ride
              </button>
            </div>
          )}
        </div>
      )}

      {/* Active Ride Panel */}
      {activeRide && (
        <div className="absolute top-4 left-4 right-4 bg-white p-4 rounded-lg shadow-lg max-w-md">
          <div className="space-y-2">
            <h3 className="font-bold text-lg">Ride Status: {rideStatus}</h3>
            <p className="text-sm text-gray-600">
              <strong>Pickup:</strong> {activeRide.pickupLocation?.address || 'N/A'}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Dropoff:</strong> {activeRide.dropoffLocation?.address || 'N/A'}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Fare:</strong> ${activeRide.fare?.toFixed(2)}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Distance:</strong> {activeRide.distance?.toFixed(2)} km
            </p>
            {activeRide.driver && (
              <p className="text-sm text-gray-600">
                <strong>Driver:</strong> {activeRide.driver.name}
              </p>
            )}
          </div>
          <button
            onClick={handleCancelRide}
            className="mt-4 w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition"
          >
            Cancel Ride
          </button>
        </div>
      )}
    </div>
  );
}
