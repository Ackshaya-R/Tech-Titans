
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/layout/Header';
import AppointmentForm from '@/components/booking/AppointmentForm';
import PageTransition from '@/components/ui/PageTransition';
import type { Doctor, LocationType } from '@/data/mockData';
import { getDoctors } from '@/data/mockData';
import DoctorCard from '@/components/doctors/DoctorCard';

// Simulate a database of booked appointments
interface BookedSlot {
  doctorId: number;
  date: string;
  time: string;
}

// This would normally come from a database
const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { doctor, locationData } = location.state || {};
  const [recommendedDoctors, setRecommendedDoctors] = useState<Doctor[]>([]);
  // In a real app, this would be fetched from an API
  const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>(() => {
    // Try to get booked slots from localStorage
    const saved = localStorage.getItem('bookedAppointments');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Save booked slots to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('bookedAppointments', JSON.stringify(bookedSlots));
  }, [bookedSlots]);
  
  // Redirect if data is not available
  useEffect(() => {
    if (!doctor || !locationData) {
      navigate('/');
    }
  }, [doctor, locationData, navigate]);

  // Get recommended doctors with the same specialty
  useEffect(() => {
    if (doctor && locationData) {
      const allDoctors = getDoctors(locationData, doctor.specialty);
      // Filter out the current doctor and get only available doctors
      const filteredDoctors = allDoctors
        .filter(d => d.id !== doctor.id && d.available)
        .slice(0, 5);  // Get up to 5 recommendations
      
      setRecommendedDoctors(filteredDoctors);
    }
  }, [doctor, locationData]);
  
  if (!doctor || !locationData) {
    return null;
  }

  const checkSlotAvailability = (date: string, time: string): boolean => {
    return !bookedSlots.some(
      slot => slot.doctorId === doctor.id && slot.date === date && slot.time === time
    );
  };

  const bookTimeSlot = (date: string, time: string) => {
    const newBooking = {
      doctorId: doctor.id,
      date,
      time
    };
    setBookedSlots([...bookedSlots, newBooking]);
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        
        <main className="flex-1 container-custom py-12">
          <div className="mb-8">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Doctors
            </button>
          </div>
          
          <div className="max-w-4xl mx-auto mb-10">
            <h1 className="text-3xl font-bold mb-2">Book Appointment</h1>
            <p className="text-muted-foreground">
              Complete the form below to book your appointment with {doctor.name}
            </p>
          </div>
          
          <AppointmentForm 
            doctor={doctor} 
            locationData={locationData} 
            checkSlotAvailability={checkSlotAvailability}
            bookTimeSlot={bookTimeSlot}
          />

          {!doctor.available && recommendedDoctors.length > 0 && (
            <div className="max-w-4xl mx-auto mt-12">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold text-amber-800 mb-4">
                  Doctor Not Available Today
                </h2>
                <p className="text-amber-700 mb-6">
                  {doctor.name} is not available for appointments today. Here are some alternative {doctor.specialty} doctors who are available:
                </p>
              </div>

              <h3 className="text-xl font-semibold mb-6">Recommended Doctors</h3>
              <div className="grid grid-cols-1 gap-6">
                {recommendedDoctors.map((recDoctor, index) => (
                  <DoctorCard 
                    key={recDoctor.id} 
                    doctor={recDoctor} 
                    locationData={locationData}
                    index={index}
                  />
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </PageTransition>
  );
};

export default BookingPage;
