
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ThumbsUp, Filter } from 'lucide-react';
import Header from '@/components/layout/Header';
import AppointmentForm from '@/components/booking/AppointmentForm';
import PageTransition from '@/components/ui/PageTransition';
import type { Doctor, LocationType } from '@/data/mockData';
import { getDoctors } from '@/data/mockData';
import DoctorCard from '@/components/doctors/DoctorCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Simulate a database of booked appointments
interface BookedSlot {
  doctorId: number;
  date: string;
  time: string;
}

// AI-powered recommendation function
const getRecommendedDoctors = (
  currentDoctor: Doctor,
  allDoctors: Doctor[],
  bookedSlots: BookedSlot[]
): Doctor[] => {
  // Filter out the current doctor
  let availableDoctors = allDoctors.filter(d => d.id !== currentDoctor.id);
  
  // Score each doctor based on various factors
  const scoredDoctors = availableDoctors.map(doctor => {
    let score = 0;
    
    // Prefer doctors with the same specialty
    if (doctor.specialty === currentDoctor.specialty) {
      score += 50;
    }
    
    // Prefer doctors with high ratings
    score += doctor.rating * 5;
    
    // Prefer doctors with more experience
    score += Math.min(doctor.experience, 20) * 1.5;
    
    // Prefer doctors with availability
    if (doctor.available) {
      score += 20;
    }
    
    // Prefer doctors with shorter wait times
    score += (60 - Math.min(doctor.waitTime || 30, 60)) * 0.5;
    
    // Lower score for doctors with many bookings
    const doctorBookings = bookedSlots.filter(slot => slot.doctorId === doctor.id).length;
    score -= doctorBookings * 2;
    
    return { doctor, score };
  });
  
  // Sort by score and return the top doctors
  return scoredDoctors
    .sort((a, b) => b.score - a.score)
    .map(item => item.doctor);
};

// This would normally come from a database
const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { doctor, locationData } = location.state || {};
  const [recommendedDoctors, setRecommendedDoctors] = useState<Doctor[]>([]);
  const [specialtyFilter, setSpecialtyFilter] = useState<string>("all");
  const [shouldShowMore, setShouldShowMore] = useState(false);
  
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
      // Get all doctors for this location based on filter
      const allDoctors = specialtyFilter === "all" 
        ? getDoctors(locationData) 
        : getDoctors(locationData, specialtyFilter);
      
      // Use the AI recommendation algorithm
      const recommended = getRecommendedDoctors(doctor, allDoctors, bookedSlots);
      
      // Limit to top recommendations, but save all for "Show more"
      setRecommendedDoctors(recommended);
    }
  }, [doctor, locationData, specialtyFilter, bookedSlots]);
  
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

  const handleSpecialtyChange = (value: string) => {
    setSpecialtyFilter(value);
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

          {/* Always show recommendations section */}
          <div className="max-w-4xl mx-auto mt-12">
            {!doctor.available && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold text-amber-800 mb-4">
                  Doctor Not Available Today
                </h2>
                <p className="text-amber-700 mb-6">
                  {doctor.name} is not available for appointments today. Please consider one of our recommended alternatives:
                </p>
              </div>
            )}

            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Recommended Doctors</h3>
              
              <Select value={specialtyFilter} onValueChange={handleSpecialtyChange}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by specialty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specialties</SelectItem>
                  <SelectItem value={doctor.specialty}>{doctor.specialty}</SelectItem>
                  <SelectItem value="Cardiologist">Cardiologist</SelectItem>
                  <SelectItem value="Dermatologist">Dermatologist</SelectItem>
                  <SelectItem value="Neurologist">Neurologist</SelectItem>
                  <SelectItem value="Orthopedic">Orthopedic</SelectItem>
                  <SelectItem value="Pediatrician">Pediatrician</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              {recommendedDoctors
                .slice(0, shouldShowMore ? recommendedDoctors.length : 5)
                .map((recDoctor, index) => (
                  <DoctorCard 
                    key={recDoctor.id} 
                    doctor={recDoctor} 
                    locationData={locationData}
                    index={index}
                  />
                ))}
            </div>
            
            {recommendedDoctors.length > 5 && (
              <div className="text-center mt-8">
                <button 
                  onClick={() => setShouldShowMore(!shouldShowMore)}
                  className="button-secondary inline-flex items-center"
                >
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  {shouldShowMore ? "Show Less" : `Show ${recommendedDoctors.length - 5} More Options`}
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

export default BookingPage;
