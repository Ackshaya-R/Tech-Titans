
import type { Doctor, LocationType } from '@/data/mockData';

// Simulated database of booked appointments
export interface BookedSlot {
  doctorId: number;
  date: string;
  time: string;
  patientId?: string; // Would be used with actual authentication
  createdAt: string;
}

// AI-driven doctor recommendation system
export interface RecommendationFactors {
  patientAge?: number;
  patientGender?: string;
  previousDoctors?: number[];
  preferredTimes?: string[];
  medicalConditions?: string[];
  preferredLanguages?: string[];
  location: LocationType;
}

// In-memory database simulation
let bookingDatabase: BookedSlot[] = [];

// Database initialization
export const initializeBookingDatabase = (): void => {
  const saved = localStorage.getItem('bookedAppointments');
  if (saved) {
    try {
      bookingDatabase = JSON.parse(saved);
    } catch (e) {
      console.error('Error parsing booked appointments from localStorage', e);
      bookingDatabase = [];
    }
  }
};

// Save to database
export const saveBooking = (booking: Omit<BookedSlot, 'createdAt'>): BookedSlot => {
  const newBooking: BookedSlot = {
    ...booking,
    createdAt: new Date().toISOString()
  };
  
  bookingDatabase.push(newBooking);
  
  // Persist to localStorage for our demo
  localStorage.setItem('bookedAppointments', JSON.stringify(bookingDatabase));
  
  return newBooking;
};

// Check availability
export const checkSlotAvailability = (doctorId: number, date: string, time: string): boolean => {
  return !bookingDatabase.some(
    slot => slot.doctorId === doctorId && slot.date === date && slot.time === time
  );
};

// Get all bookings for a doctor
export const getDoctorBookings = (doctorId: number): BookedSlot[] => {
  return bookingDatabase.filter(booking => booking.doctorId === doctorId);
};

// Get all bookings for a patient
export const getPatientBookings = (patientId: string): BookedSlot[] => {
  return bookingDatabase.filter(booking => booking.patientId === patientId);
};

// Calculate doctor busyness score (higher = busier)
export const calculateDoctorBusynessScore = (doctorId: number): number => {
  const doctorBookings = getDoctorBookings(doctorId);
  
  // Count recent bookings (last 7 days) with higher weight
  const now = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(now.getDate() - 7);
  
  const recentBookings = doctorBookings.filter(booking => 
    new Date(booking.createdAt) >= sevenDaysAgo
  );
  
  // Basic busyness score formula
  return (doctorBookings.length * 1) + (recentBookings.length * 2);
};

// AI-driven recommendation function
export const getRecommendedDoctors = (
  doctors: Doctor[],
  factors: RecommendationFactors
): Doctor[] => {
  // Initialize the database if not already done
  if (bookingDatabase.length === 0) {
    initializeBookingDatabase();
  }
  
  // Calculate scores for each doctor
  const scoredDoctors = doctors.map(doctor => {
    let score = 50; // Base score
    
    // Factor 1: Doctor rating (0-5 scale, heavily weighted)
    score += doctor.rating * 10;
    
    // Factor 2: Experience years (capped at 20 years)
    score += Math.min(doctor.experience, 20) * 1.5;
    
    // Factor 3: Availability
    if (doctor.available) {
      score += 15;
    }
    
    // Factor 4: Wait time (inverse relationship)
    if (doctor.waitTime !== undefined) {
      // Lower wait time is better: max 20 points for 0 wait time
      score += Math.max(0, 20 - (doctor.waitTime / 3));
    }
    
    // Factor 5: Busyness (inverse relationship)
    const busynessScore = calculateDoctorBusynessScore(doctor.id);
    score -= Math.min(busynessScore * 0.5, 15); // Cap the penalty
    
    // Factor 6: Distance from user's location (simplified for demo)
    // In a real implementation, we would calculate actual distance
    // Extract location from address instead of accessing a non-existent property
    const doctorAddressParts = doctor.address.split(', ');
    const doctorArea = doctorAddressParts[0];
    const doctorDistrict = doctorAddressParts[1];
    
    if (doctorArea === factors.location.area) {
      score += 15; // Same area
    } else if (doctorDistrict === factors.location.district) {
      score += 10; // Same district
    }
    
    // Add a small random factor for natural distribution
    score += Math.random() * 5;
    
    return { doctor, score };
  });
  
  // Sort by score (descending) and return just the doctors
  return scoredDoctors
    .sort((a, b) => b.score - a.score)
    .map(item => item.doctor);
};

// Get recommended time slots based on AI analysis
export const getRecommendedTimeSlots = (
  doctorId: number,
  date: string,
  availableSlots: string[]
): string[] => {
  if (!availableSlots.length) return [];
  
  // Get all bookings for this doctor
  const doctorBookings = getDoctorBookings(doctorId);
  
  // Score each available slot
  const scoredSlots = availableSlots.map(slot => {
    let score = 50; // Base score
    
    // Parse the time
    const hour = parseInt(slot.split(':')[0]);
    const isPM = slot.includes('PM');
    const hour24 = isPM && hour !== 12 ? hour + 12 : hour;
    
    // Factor 1: Preferred times of day
    // Morning slots (9-11 AM) are generally preferred
    if (hour24 >= 9 && hour24 <= 11) {
      score += 10;
    } 
    // Early afternoon (2-3 PM) next preferred
    else if (hour24 >= 14 && hour24 <= 15) {
      score += 5;
    }
    
    // Factor 2: Avoid slots right after lunch or at end of day
    if (hour24 === 13 || hour24 === 17) {
      score -= 5;
    }
    
    // Factor 3: Check adjacent slot availability (prefer clustered slots)
    const adjacentSlotBooked = doctorBookings.some(booking => {
      if (booking.date !== date) return false;
      
      // Check if there's a booking 30 minutes before or after
      const bookingHour = parseInt(booking.time.split(':')[0]);
      const bookingIsPM = booking.time.includes('PM');
      const bookingHour24 = bookingIsPM && bookingHour !== 12 ? bookingHour + 12 : bookingHour;
      const bookingMinute = parseInt(booking.time.split(':')[1]);
      
      const slotMinute = parseInt(slot.split(':')[1]);
      
      // Convert both times to minutes since midnight
      const bookingTotalMinutes = bookingHour24 * 60 + bookingMinute;
      const slotTotalMinutes = hour24 * 60 + slotMinute;
      
      // Check if they're 30 minutes apart
      return Math.abs(bookingTotalMinutes - slotTotalMinutes) === 30;
    });
    
    if (adjacentSlotBooked) {
      score += 8; // Prefer slots next to existing bookings for efficiency
    }
    
    // Add randomness for natural distribution
    score += Math.random() * 10;
    
    return { slot, score };
  });
  
  // Sort by score and return
  return scoredSlots
    .sort((a, b) => b.score - a.score)
    .map(item => item.slot);
};

