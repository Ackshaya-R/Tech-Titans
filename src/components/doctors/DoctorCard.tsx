
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Star, Calendar, Clock, MapPin, Check, X } from 'lucide-react';
import type { Doctor, LocationType } from '@/data/mockData';
import DoctorLocationMap from './DoctorLocationMap';

interface DoctorCardProps {
  doctor: Doctor;
  locationData: LocationType;
  index?: number; // Make index optional
}

const DoctorCard = ({ doctor, locationData, index = 0 }: DoctorCardProps) => {
  const navigate = useNavigate();

  const handleBookAppointment = () => {
    navigate('/booking', { state: { doctor, locationData } });
  };

  return (
    <motion.div
      className="bg-white rounded-xl overflow-hidden border border-border shadow-card transition-all hover:shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/4 p-6 bg-primary/5 flex items-center justify-center">
          <div className="rounded-full overflow-hidden w-28 h-28 border-4 border-white shadow-md">
            <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
          </div>
        </div>
        
        <div className="md:w-3/4 p-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold">{doctor.name}</h3>
              <p className="text-primary">{doctor.specialty}</p>
              
              <div className="flex items-center mt-1">
                <div className="flex items-center text-amber-500 mr-2">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="ml-1 text-sm font-medium">{doctor.rating.toFixed(1)}</span>
                </div>
                <span className="text-xs text-muted-foreground">({doctor.reviews} reviews)</span>
              </div>
              
              <p className="text-sm text-muted-foreground mt-1">{doctor.experience} years of experience</p>
            </div>
            
            <div className="flex items-center mt-3 md:mt-0">
              <div 
                className={`relative px-3 py-1 rounded-full text-sm font-medium flex items-center ${
                  doctor.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}
                title={doctor.available ? "Doctor is available for appointments today" : "Doctor is not available for appointments today"}
              >
                {doctor.available ? (
                  <>
                    <Check className="w-3 h-3 mr-1" />
                    Available Today
                  </>
                ) : (
                  <>
                    <X className="w-3 h-3 mr-1" />
                    Not Available
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex items-start space-x-2 mb-1">
              <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span className="text-sm">{doctor.clinic}, {doctor.address}</span>
            </div>
            
            <div className="flex items-start space-x-2 mb-1">
              <Calendar className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span className="text-sm">Available on: {doctor.availableDays.join(', ')}</span>
            </div>
            
            <div className="flex items-start space-x-2">
              <Clock className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span className="text-sm">Estimated Wait Time: {doctor.waitTime} mins</span>
            </div>
          </div>
          
          <DoctorLocationMap doctor={doctor} />
          
          <div className="mt-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Consultation Fee</p>
              <p className="text-xl font-bold text-primary">₹{doctor.fee}</p>
            </div>
            
            <motion.button
              className="button-primary"
              onClick={handleBookAppointment}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={!doctor.available}
              title={doctor.available ? "Book an appointment with this doctor" : "This doctor is not available for appointments today"}
            >
              Book Appointment
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DoctorCard;
