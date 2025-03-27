import { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { getAvailableLocations, getStateCoordinates, getDistrictCoordinates, getAreaCoordinates, LocationType } from '@/data/mockData';
import { toast } from "sonner";
import LocationMap from './LocationMap';

interface LocationFormProps {
  onSubmit?: (locationData: LocationType) => void;
  initialLocation?: LocationType | null;
}

const LocationForm = ({ onSubmit, initialLocation }: LocationFormProps = {}) => {
  const navigate = useNavigate();
  const { areas, districts, states, countries, stateToDistricts, getAreasForDistrict } = getAvailableLocations();
  
  // Sort location data alphabetically
  const sortedStates = [...states].sort((a, b) => a.localeCompare(b));
  
  const [formData, setFormData] = useState({
    area: initialLocation?.area || '',
    district: initialLocation?.district || '',
    state: initialLocation?.state || '',
    country: initialLocation?.country || 'India' // Default to India
  });
  
  // Filter options based on selections
  const [filteredDistricts, setFilteredDistricts] = useState<string[]>([]);
  const [filteredAreas, setFilteredAreas] = useState<string[]>([]);
  const [selectedCoordinates, setSelectedCoordinates] = useState<[number, number]>([78.96, 20.59]); // Default to center of India
  
  // Initialize filtered options based on initial location
  useEffect(() => {
    if (initialLocation?.state) {
      const stateDistricts = stateToDistricts[initialLocation.state] || [];
      setFilteredDistricts(stateDistricts.sort((a, b) => a.localeCompare(b)));
      
      if (initialLocation.district) {
        const districtAreas = getAreasForDistrict(initialLocation.district);
        setFilteredAreas(districtAreas.sort((a, b) => a.localeCompare(b)));
      }
    }
  }, [initialLocation]);
  
  // Set India coordinates by default
  useEffect(() => {
    if (initialLocation?.state && initialLocation?.district && initialLocation?.area) {
      setSelectedCoordinates(getAreaCoordinates(initialLocation.state, initialLocation.district, initialLocation.area));
    } else if (initialLocation?.state && initialLocation?.district) {
      setSelectedCoordinates(getDistrictCoordinates(initialLocation.state, initialLocation.district));
    } else if (initialLocation?.state) {
      setSelectedCoordinates(getStateCoordinates(initialLocation.state));
    } else {
      setSelectedCoordinates([78.96, 20.59]); // Center of India
    }
  }, [initialLocation]);
  
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Update form data
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Update filtered options based on selection
    if (name === 'state') {
      if (value) {
        // Get districts for the selected state
        const stateDistricts = stateToDistricts[value] || [];
        setFilteredDistricts(stateDistricts.sort((a, b) => a.localeCompare(b)));
        
        // Update map coordinates based on selected state
        setSelectedCoordinates(getStateCoordinates(value));
      } else {
        setFilteredDistricts([]);
        setSelectedCoordinates([78.96, 20.59]); // Reset to center of India
      }
      
      // Reset district and area selections
      setFilteredAreas([]);
      setFormData(prev => ({ ...prev, district: '', area: '' }));
    }
    
    if (name === 'district') {
      if (value) {
        // Get areas for the selected district
        const districtAreas = getAreasForDistrict(value);
        setFilteredAreas(districtAreas.sort((a, b) => a.localeCompare(b)));
        
        // Update map coordinates based on selected district
        setSelectedCoordinates(getDistrictCoordinates(formData.state, value));
      } else {
        setFilteredAreas([]);
        // Reset to state coordinates if district is cleared
        if (formData.state) {
          setSelectedCoordinates(getStateCoordinates(formData.state));
        }
      }
      
      // Reset area selection
      setFormData(prev => ({ ...prev, area: '' }));
    }
    
    if (name === 'area' && value) {
      // Update map coordinates for selected area
      setSelectedCoordinates(getAreaCoordinates(formData.state, formData.district, value));
    }
  };
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Check if all fields are filled
    if (!formData.area || !formData.district || !formData.state) {
      toast.error("Please select all location fields before searching.");
      return;
    }
    
    // Save location to localStorage
    localStorage.setItem('selectedLocation', JSON.stringify(formData));
    
    // Use the onSubmit prop if provided, otherwise navigate
    if (onSubmit) {
      onSubmit(formData as LocationType);
    } else {
      // Navigate to doctors page with location data
      navigate('/doctors', { state: { locationData: formData } });
    }
  };
  
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="w-full max-w-3xl mx-auto relative"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="glass-card overflow-hidden p-6 relative z-10">
        <div className="flex items-center space-x-2 mb-6">
          <MapPin className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Find Doctors Near You</h2>
        </div>
        
        <form onSubmit={handleSubmit}>
          <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6" variants={itemVariants}>
            <div className="space-y-2">
              <label htmlFor="country" className="text-sm font-medium text-foreground">
                Country
              </label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="input-field bg-gray-100"
                disabled={true} // Disabled as we're only showing India
              >
                <option value="India">India</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="state" className="text-sm font-medium text-foreground">
                State/Union Territory
              </label>
              <select
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                className="input-field"
              >
                <option value="">Select State/Union Territory</option>
                {sortedStates.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="district" className="text-sm font-medium text-foreground">
                District/City
              </label>
              <select
                id="district"
                name="district"
                value={formData.district}
                onChange={handleChange}
                required
                className="input-field"
                disabled={!formData.state}
              >
                <option value="">Select District/City</option>
                {filteredDistricts.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="area" className="text-sm font-medium text-foreground">
                Area/Neighborhood
              </label>
              <select
                id="area"
                name="area"
                value={formData.area}
                onChange={handleChange}
                required
                className="input-field"
                disabled={!formData.district}
              >
                <option value="">Select Area/Neighborhood</option>
                {filteredAreas.map(area => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>
          </motion.div>
          
          <motion.div
            className="flex justify-center"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <button
              type="submit"
              className="button-primary w-full md:w-auto"
              disabled={!formData.area || !formData.district || !formData.state}
            >
              <Search className="w-4 h-4 mr-2" />
              Find Doctors
            </button>
          </motion.div>
        </form>
      </div>
      
      {/* Replace the map with an image for now */}
      <div className="absolute inset-0 -z-10 rounded-xl overflow-hidden">
        <img 
          src="/india-map.png" 
          alt="India map with location pins"
          className="w-full h-full object-cover"
        />
      </div>
    </motion.div>
  );
};

export default LocationForm;
