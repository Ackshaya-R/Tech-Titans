
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Map, MapPin } from 'lucide-react';
import LocationMap from '@/components/location/LocationMap';
import type { Doctor } from '@/data/mockData';

interface DoctorLocationMapProps {
  doctor: Doctor;
}

const DoctorLocationMap = ({ doctor }: DoctorLocationMapProps) => {
  const [showMap, setShowMap] = useState(false);

  const toggleMap = () => {
    setShowMap(!showMap);
  };

  // Generate coordinates based on the address for consistency
  const generateCoordinates = (address: string): [number, number] => {
    // Extract district name for more accurate location
    const districtParts = address.split(',');
    const district = districtParts.length > 1 ? districtParts[1].trim() : address;
    
    // Use a deterministic approach based on the district name
    let hash = 0;
    for (let i = 0; i < district.length; i++) {
      hash = district.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // India's longitude ranges roughly from 68°E to 97°E
    // India's latitude ranges roughly from 8°N to 37°N
    const longitude = 68 + (Math.abs(hash) % 29); // Between 68 and 97
    const latitude = 8 + (Math.abs(hash >> 8) % 29); // Between 8 and 37
    
    return [longitude, latitude];
  };

  const coordinates = generateCoordinates(doctor.address);
  const address = `${doctor.clinic}, ${doctor.address}`;

  return (
    <div className="mt-4">
      <button 
        onClick={toggleMap} 
        className="flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
      >
        <Map className="w-4 h-4 mr-1" />
        {showMap ? 'Hide location map' : 'Show location map'}
      </button>
      
      {showMap && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-3"
        >
          <LocationMap 
            coordinates={coordinates}
            zoom={14}
            className="h-48 border border-border"
            showMarker={true}
          />
          <div className="mt-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 inline-block mr-1 text-primary" />
            {address}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DoctorLocationMap;
