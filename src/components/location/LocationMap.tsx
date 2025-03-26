
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin } from 'lucide-react';

// In a production app, this should be stored in environment variables
const MAPBOX_PUBLIC_TOKEN = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';

interface LocationMapProps {
  coordinates: [number, number]; // [longitude, latitude]
  zoom?: number;
  className?: string;
  showMarker?: boolean;
  mapStyle?: string;
}

const LocationMap = ({ 
  coordinates, 
  zoom = 8, 
  className = '',
  showMarker = true,
  mapStyle = 'mapbox://styles/mapbox/streets-v12'
}: LocationMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [userApiKey, setUserApiKey] = useState<string>(MAPBOX_PUBLIC_TOKEN);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainer.current || !coordinates) return;

    // Initialize map only once
    if (!map.current) {
      // Use the user provided API key or the default one
      mapboxgl.accessToken = userApiKey;
      
      try {
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: mapStyle,
          center: coordinates,
          zoom: zoom,
          interactive: true,
          attributionControl: false
        });

        // Add navigation controls
        map.current.addControl(
          new mapboxgl.NavigationControl(),
          'top-right'
        );

        if (showMarker) {
          // Add marker
          marker.current = new mapboxgl.Marker({ color: '#F43F5E' })
            .setLngLat(coordinates)
            .addTo(map.current);
        }

        map.current.on('load', () => {
          setMapLoaded(true);
          setMapError(null); // Clear any previous errors
        });

        map.current.on('error', (e) => {
          console.error('Map error:', e);
          setMapError('Failed to load map. Please check your connection or API key.');
        });
      } catch (error) {
        console.error('Error initializing map:', error);
        setMapError('Failed to initialize map. Please try again later.');
      }
    } else {
      // Update existing map
      try {
        map.current.flyTo({
          center: coordinates,
          zoom: zoom,
          essential: true,
          duration: 1000
        });

        // Update marker position if it exists
        if (marker.current && showMarker) {
          marker.current.setLngLat(coordinates);
        }
      } catch (error) {
        console.error('Error updating map:', error);
      }
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
        marker.current = null;
      }
    };
  }, [coordinates, zoom, userApiKey, showMarker, mapStyle]);

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserApiKey(e.target.value);
  };

  return (
    <div className={`relative ${className}`}>
      {mapError && (
        <div className="absolute top-0 left-0 right-0 z-10 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">
            {mapError} You may need to provide your own Mapbox API key. Get one at <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="underline">mapbox.com</a>
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
      
      {!mapLoaded && !mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="flex flex-col items-center text-gray-500">
            <MapPin className="w-8 h-8 mb-2 animate-pulse" />
            <p>Loading map...</p>
          </div>
        </div>
      )}
      
      <div 
        ref={mapContainer} 
        className="w-full h-full rounded-lg"
      />
      
      {/* Semi-transparent overlay - removed to make map more visible */}
    </div>
  );
};

export default LocationMap;
