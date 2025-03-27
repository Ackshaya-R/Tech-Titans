
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Clock, Calendar } from 'lucide-react';
import Header from '@/components/layout/Header';
import PageTransition from '@/components/ui/PageTransition';
import { useToast } from '@/hooks/use-toast';
import { LocationType, getDoctors, Doctor } from '@/data/mockData';
import { 
  checkSlotAvailability, 
  getRecommendedDoctors, 
  getRecommendedTimeSlots 
} from '@/utils/bookingUtils';
import EmergencyBookingForm from '@/components/booking/EmergencyBookingForm';
import { initializeBookingDatabase, saveBooking } from '@/utils/bookingUtils';

const EmergencyPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [locationData, setLocationData] = useState<LocationType | null>(null);
  const [availableDoctors, setAvailableDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize booking database when the component mounts
  useEffect(() => {
    initializeBookingDatabase();
  }, []);

  // Redirect to home if no location is selected after 500ms
  useEffect(() => {
    if (!locationData) {
      const storedLocation = localStorage.getItem('selectedLocation');
      if (storedLocation) {
        try {
          setLocationData(JSON.parse(storedLocation));
        } catch (e) {
          // If parsing fails, navigate home after a short delay
          const timer = setTimeout(() => navigate('/'), 500);
          return () => clearTimeout(timer);
        }
      } else {
        // If no stored location, navigate home after a short delay
        const timer = setTimeout(() => navigate('/'), 500);
        return () => clearTimeout(timer);
      }
    }

    // If we have location data, fetch available doctors
    if (locationData) {
      // Get all doctors for this location
      const allDoctors = getDoctors(locationData);
      
      // Filter to only include available doctors
      const available = allDoctors.filter(doctor => doctor.available);
      
      // If we have more than 5 doctors, use the recommendation algorithm to prioritize them
      if (available.length > 5) {
        // Fixed: passing the correct types to getRecommendedDoctors
        const recommended = getRecommendedDoctors(available, { location: locationData });
        setAvailableDoctors(recommended.slice(0, 10)); // Show up to 10 doctors for emergencies
      } else {
        setAvailableDoctors(available);
      }
      
      setLoading(false);
    }
  }, [locationData, navigate]);

  const handleBookEmergency = (
    doctor: Doctor, 
    date: string, 
    time: string, 
    patientInfo: { name: string; phone: string; reason: string }
  ) => {
    // Save the booking
    saveBooking({
      doctorId: doctor.id,
      date,
      time,
      patientId: patientInfo.name // Using name as ID for demo purposes
    });

    // Navigate to confirmation
    navigate('/confirmation', {
      state: {
        doctor,
        locationData,
        appointment: {
          name: patientInfo.name,
          phone: patientInfo.phone,
          reason: patientInfo.reason,
          date,
          time,
          appointmentNumber: Math.floor(100000 + Math.random() * 900000),
          fee: doctor.fee,
          waitTime: doctor.waitTime || Math.floor(5 + Math.random() * 20), // Shorter wait time for emergencies
          isEmergency: true
        }
      }
    });

    // Show success toast
    toast({
      title: "Emergency Appointment Booked",
      description: `Your emergency appointment with Dr. ${doctor.name} is confirmed for today at ${time}`,
    });
  };

  if (!locationData || loading) {
    return (
      <PageTransition>
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900">
          <Header />
          <main className="flex-1 container-custom py-12 flex items-center justify-center">
            <div className="animate-pulse text-center">
              <Clock className="h-12 w-12 mx-auto mb-4 text-red-500" />
              <p className="text-lg text-red-700">Loading available doctors...</p>
            </div>
          </main>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900">
        <Header />
        
        <main className="flex-1 container-custom py-6">
          <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-red-800">Emergency Appointment Booking</h3>
                <div className="mt-2 text-red-700">
                  <p>
                    This page is for <strong>medical emergencies only</strong>. 
                    Emergency appointments are available for today only.
                    For non-emergency appointments, please use the 
                    <a href="/doctors" className="underline ml-1 text-red-800 font-medium">regular booking system</a>.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold mb-6 text-red-800">Emergency Appointment</h1>
          
          {availableDoctors.length === 0 ? (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-amber-800 mb-2">
                No Doctors Available Today
              </h2>
              <p className="text-amber-700 mb-4">
                We're sorry, but there are no doctors available for emergency appointments today.
                Please visit the nearest emergency room or call emergency services.
              </p>
              <div className="bg-white p-4 rounded border border-amber-200">
                <p className="font-semibold text-amber-800">Emergency Contacts:</p>
                <p className="text-amber-700">Emergency Services: 911</p>
              </div>
            </div>
          ) : (
            <EmergencyBookingForm 
              availableDoctors={availableDoctors}
              locationData={locationData}
              onBookAppointment={handleBookEmergency}
            />
          )}
        </main>
      </div>
    </PageTransition>
  );
};

export default EmergencyPage;
