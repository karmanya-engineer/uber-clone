import { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { rides } from '../lib/api';
import io from 'socket.io-client';

const containerStyle = {
  width: '100%',
  height: 'calc(100vh - 80px)',
};

export default function DriverMap({ currentRide }) {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [directions, setDirections] = useState(null);
  const mapRef = useRef(null);
  const socketRef = useRef(null);
  const watchIdRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  // Get driver's current location and watch for updates
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentPosition(pos);
        },
        () => {
          const defaultPos = { lat: 40.7128, lng: -74.0060 };
          setCurrentPosition(defaultPos);
        }
      );

      // Watch position for real-time updates
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentPosition(pos);
          
          // Update location on server
          require('../lib/api').users.updateLocation(pos);

          // Update location for active ride
          if (currentRide) {
            rides.updateLocation(currentRide._id, pos);
          }
        },
        (error) => console.error('Geolocation error:', error),
        { enableHighAccuracy: true }
      );
    }

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [currentRide]);

  // Connect to socket for ride updates
  useEffect(() => {
    if (currentRide) {
      socketRef.current = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000');
      socketRef.current.emit('join-ride', currentRide._id);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [currentRide]);

  // Calculate route when ride is active
  useEffect(() => {
    if (!currentRide || !currentPosition || !mapRef.current) return;

    const directionsService = new window.google.maps.DirectionsService();
    
    if (currentRide.status === 'driver-assigned' || currentRide.status === 'in-progress') {
      directionsService.route(
        {
          origin: currentPosition,
          destination: currentRide.status === 'driver-assigned' 
            ? currentRide.pickupLocation 
            : currentRide.dropoffLocation,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === 'OK' && result) {
            setDirections(result);
          }
        }
      );
    }
  }, [currentRide, currentPosition]);

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading Google Maps...</div>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={currentPosition || { lat: 40.7128, lng: -74.0060 }}
      zoom={15}
      onLoad={onMapLoad}
    >
      {currentPosition && (
        <Marker
          position={currentPosition}
          label="🚗"
          icon={{
            url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
          }}
        />
      )}

      {currentRide && currentRide.pickupLocation && (
        <Marker
          position={currentRide.pickupLocation}
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

      {currentRide && currentRide.dropoffLocation && (
        <Marker
          position={currentRide.dropoffLocation}
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

      {directions && <DirectionsRenderer directions={directions} />}
    </GoogleMap>
  );
}
