
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter, AlertTriangle } from 'lucide-react';
import type { Doctor, LocationType } from '@/data/mockData';
import { findDoctorsByLocationAndSpecialty, findNearbyDoctors, specialties } from '@/data/mockData';
import DoctorCard from './DoctorCard';

interface DoctorsListProps {
  locationData: LocationType;
  specialty?: string;
}

const DoctorsList = ({ locationData, specialty }: DoctorsListProps) => {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>(specialty || '');
  const [doctorsList, setDoctorsList] = useState<Doctor[]>([]);
  const [nearbyDoctors, setNearbyDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (specialty) {
      setSelectedSpecialty(specialty);
    }
  }, [specialty]);
  
  useEffect(() => {
    // Simulate loading
    setLoading(true);
    
    setTimeout(() => {
      if (selectedSpecialty) {
        const doctors = findDoctorsByLocationAndSpecialty(locationData, selectedSpecialty);
        setDoctorsList(doctors);
        
        // If no doctors found in the exact location, find nearby doctors
        if (doctors.length === 0) {
          const nearby = findNearbyDoctors(locationData, selectedSpecialty);
          setNearbyDoctors(nearby);
        } else {
          setNearbyDoctors([]);
        }
      } else {
        setDoctorsList([]);
        setNearbyDoctors([]);
      }
      
      setLoading(false);
    }, 800);
  }, [selectedSpecialty, locationData]);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Select Specialty</h2>
        </div>
        
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {specialties.map((specialty) => (
            <motion.button
              key={specialty.id}
              onClick={() => setSelectedSpecialty(specialty.id)}
              className={`p-4 rounded-lg border ${
                selectedSpecialty === specialty.id
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-border bg-background hover:bg-secondary/50'
              } transition-all duration-200 text-left`}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-2xl mb-2">{specialty.icon}</div>
              <h3 className="font-medium mb-1">{specialty.name}</h3>
              <p className="text-xs text-muted-foreground truncate">{specialty.description}</p>
            </motion.button>
          ))}
        </motion.div>
      </div>
      
      {selectedSpecialty ? (
        <>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              {loading ? 'Searching doctors...' : `Available Doctors (${doctorsList.length})`}
            </h2>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-full h-48 bg-gray-100 animate-pulse rounded-xl"></div>
              ))}
            </div>
          ) : doctorsList.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {doctorsList.map((doctor, index) => (
                <DoctorCard 
                  key={doctor.id} 
                  doctor={doctor} 
                  locationData={locationData}
                  index={index}
                />
              ))}
            </motion.div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
              <div className="flex items-start">
                <AlertTriangle className="w-6 h-6 text-amber-500 mr-4 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium text-amber-800 mb-2">No doctors found in your selected area</h3>
                  <p className="text-amber-700 mb-4">
                    We couldn't find any {specialties.find(s => s.id === selectedSpecialty)?.name} 
                    in {locationData.area}, {locationData.district}.
                  </p>
                  
                  {nearbyDoctors.length > 0 && (
                    <>
                      <h4 className="font-medium text-green-800 mb-2">
                        We found nearby doctors that might help:
                      </h4>
                      <div className="grid grid-cols-1 gap-6 mt-4">
                        {nearbyDoctors.map((doctor, index) => (
                          <DoctorCard
                            key={doctor.id}
                            doctor={doctor}
                            locationData={locationData}
                            index={index}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center p-10 border border-dashed border-border rounded-lg">
          <p className="text-muted-foreground">
            Please select a specialty to view available doctors
          </p>
        </div>
      )}
    </div>
  );
};

export default DoctorsList;
