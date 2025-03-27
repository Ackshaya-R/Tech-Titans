
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin } from 'lucide-react';

// In a production app, this should be stored in environment variables
const MAPBOX_PUBLIC_TOKEN = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';

interface MapLocationProps {
  address: string;
  coordinates?: [number, number]; // [longitude, latitude]
  className?: string;
}

const MapLocation = ({ address, coordinates, className = '' }: MapLocationProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [userApiKey, setUserApiKey] = useState<string>(MAPBOX_PUBLIC_TOKEN);
  const [mapError, setMapError] = useState<string | null>(null);

  // Default coordinates (will be used if no coordinates are provided)
  const defaultCoordinates: [number, number] = coordinates || [0, 0]; // World center

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map only once
    if (!map.current) {
      mapboxgl.accessToken = userApiKey;
      
      try {
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: defaultCoordinates,
          zoom: 9,
          interactive: true // Enable interactions for a better user experience
        });

        // Add marker
        marker.current = new mapboxgl.Marker({ color: '#F43F5E' })
          .setLngLat(defaultCoordinates)
          .addTo(map.current);

        // Add navigation controls for better user interaction
        map.current.addControl(
          new mapboxgl.NavigationControl(),
          'top-right'
        );

        map.current.on('load', () => {
          setMapLoaded(true);
          setMapError(null);
        });

        map.current.on('error', (e) => {
          console.error('Map error:', e);
          setMapError('Failed to load map. Please check your API key.');
        });
      } catch (error) {
        console.error('Error initializing map:', error);
        setMapError('Failed to initialize map.');
      }
    } else if (coordinates) {
      // Update existing map if coordinates change
      map.current.flyTo({
        center: coordinates,
        zoom: 9,
        essential: true
      });

      if (marker.current) {
        marker.current.setLngLat(coordinates);
      }
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [defaultCoordinates, userApiKey]);

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserApiKey(e.target.value);
  };

  return (
    <div className={`rounded-lg overflow-hidden ${className}`}>
      {mapError && (
        <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">
            {mapError} Get one at <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="underline">mapbox.com</a>
          </p>
          <input 
            type="text"
            value={userApiKey}
            onChange={handleApiKeyChange}
            placeholder="Enter Mapbox API key"
            className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      )}
      {!mapLoaded && (
        <div className="flex items-center justify-center bg-gray-100 h-48 rounded-lg">
          <div className="flex flex-col items-center text-gray-500">
            <MapPin className="w-8 h-8 mb-2 animate-pulse" />
            <p>Loading map...</p>
          </div>
        </div>
      )}
      <div 
        ref={mapContainer} 
        className="w-full h-48 bg-gray-100"
        style={{ display: mapLoaded ? 'block' : 'none' }}
      />
      <div className="mt-2 text-sm text-muted-foreground">
        <MapPin className="w-4 h-4 inline-block mr-1 text-primary" />
        {address}
      </div>
    </div>
  );
};

export default MapLocation;
