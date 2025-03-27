
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, MessageSquare, Clock, Calendar } from 'lucide-react';
import type { Doctor, LocationType } from '@/data/mockData';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { checkSlotAvailability, getRecommendedTimeSlots } from '@/utils/bookingUtils';
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from '@/hooks/use-toast';

interface EmergencyBookingFormProps {
  availableDoctors: Doctor[];
  locationData: LocationType;
  onBookAppointment: (
    doctor: Doctor, 
    date: string, 
    time: string, 
    patientInfo: { name: string; phone: string; reason: string }
  ) => void;
}

const EmergencyBookingForm = ({ 
  availableDoctors, 
  locationData, 
  onBookAppointment 
}: EmergencyBookingFormProps) => {
  const { toast } = useToast();
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    reason: '',
    time: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Create emergency time slots (current time + 30 mins to end of day, in 30 min intervals)
  useEffect(() => {
    if (selectedDoctor) {
      // Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split('T')[0];
      
      // Generate time slots starting from the next 30-minute interval
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      
      // Start time (round up to next 30 minute interval)
      let startHour = currentHour;
      let startMinute = currentMinute >= 30 ? 0 : 30;
      
      if (currentMinute >= 30) {
        startHour += 1;
        startMinute = 0;
      }
      
      // Generate all possible time slots for the rest of today
      const allPossibleSlots = [];
      
      for (let hour = startHour; hour < 22; hour++) { // End at 10 PM
        for (let minute of [0, 30]) {
          // Skip initial times before our start time
          if (hour === startHour && minute < startMinute) continue;
          
          const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
          const amPm = hour >= 12 ? 'PM' : 'AM';
          const formattedTime = `${formattedHour}:${minute === 0 ? '00' : minute} ${amPm}`;
          
          allPossibleSlots.push(formattedTime);
        }
      }
      
      // Filter only available slots
      const availableSlots = allPossibleSlots.filter(time => 
        checkSlotAvailability(selectedDoctor.id, today, time)
      );
      
      // Use AI recommendation for ordering if we have enough slots
      if (availableSlots.length > 1) {
        const recommendedSlots = getRecommendedTimeSlots(selectedDoctor.id, today, availableSlots);
        setAvailableTimeSlots(recommendedSlots);
      } else {
        setAvailableTimeSlots(availableSlots);
      }
    } else {
      setAvailableTimeSlots([]);
    }
  }, [selectedDoctor]);

  const handleDoctorChange = (doctorId: string) => {
    const doctor = availableDoctors.find(d => d.id === parseInt(doctorId));
    setSelectedDoctor(doctor || null);
    setFormData(prev => ({ ...prev, time: '' }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Patient name is required";
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }
    
    if (!formData.reason.trim()) {
      newErrors.reason = "Reason for emergency is required";
    }
    
    if (!selectedDoctor) {
      newErrors.doctor = "Please select a doctor";
    }
    
    if (!formData.time) {
      newErrors.time = "Please select an appointment time";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm() && selectedDoctor) {
      const today = new Date().toISOString().split('T')[0];
      
      // Double-check availability (in case someone else booked while the form was open)
      if (!checkSlotAvailability(selectedDoctor.id, today, formData.time)) {
        toast({
          title: "Time slot no longer available",
          description: "This time slot was just booked by another patient. Please select a different time.",
          variant: "destructive"
        });
        
        // Refresh available time slots
        const now = new Date();
        const allPossibleSlots = [];
        
        for (let hour = now.getHours(); hour < 22; hour++) {
          for (let minute of [0, 30]) {
            const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
            const amPm = hour >= 12 ? 'PM' : 'AM';
            const formattedTime = `${formattedHour}:${minute === 0 ? '00' : minute} ${amPm}`;
            allPossibleSlots.push(formattedTime);
          }
        }
        
        const availableSlots = allPossibleSlots.filter(time => 
          checkSlotAvailability(selectedDoctor.id, today, time)
        );
        
        setAvailableTimeSlots(availableSlots);
        setFormData(prev => ({ ...prev, time: '' }));
        return;
      }
      
      // Process the booking
      onBookAppointment(
        selectedDoctor,
        today,
        formData.time,
        {
          name: formData.name,
          phone: formData.phone,
          reason: formData.reason
        }
      );
    }
  };

  return (
    <Card className="border-red-200 shadow-lg">
      <CardHeader className="bg-red-100">
        <CardTitle className="flex items-center gap-2 text-red-800">
          <Clock className="h-5 w-5 text-red-600" />
          Emergency Appointment Booking
        </CardTitle>
        <CardDescription className="text-red-700">
          Fill out this form for same-day emergency appointments
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium">
                  Patient Name <span className="text-red-500">*</span>
                </Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`pl-9 ${errors.name ? 'border-red-300' : ''}`}
                    placeholder="Enter patient name"
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="phone" className="text-sm font-medium">
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`pl-9 ${errors.phone ? 'border-red-300' : ''}`}
                    placeholder="Enter phone number"
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="reason" className="text-sm font-medium">
                  Reason for Emergency <span className="text-red-500">*</span>
                </Label>
                <div className="relative mt-1">
                  <MessageSquare className="absolute left-3 top-3 text-muted-foreground h-4 w-4" />
                  <Textarea
                    id="reason"
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    className={`pl-9 ${errors.reason ? 'border-red-300' : ''}`}
                    placeholder="Briefly describe the emergency"
                    rows={4}
                  />
                </div>
                {errors.reason && (
                  <p className="text-red-500 text-sm mt-1">{errors.reason}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="doctor" className="text-sm font-medium">
                  Available Doctor <span className="text-red-500">*</span>
                </Label>
                <Select
                  onValueChange={handleDoctorChange}
                  value={selectedDoctor ? selectedDoctor.id.toString() : ""}
                >
                  <SelectTrigger className={`${errors.doctor ? 'border-red-300' : ''}`}>
                    <SelectValue placeholder="Select a doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDoctors.map(doctor => (
                      <SelectItem key={doctor.id} value={doctor.id.toString()}>
                        Dr. {doctor.name} - {doctor.specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.doctor && (
                  <p className="text-red-500 text-sm mt-1">{errors.doctor}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="date" className="text-sm font-medium">
                  Appointment Date
                </Label>
                <div className="relative mt-1">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    value={new Date().toLocaleDateString()}
                    readOnly
                    className="pl-9 bg-gray-50"
                  />
                </div>
                <p className="text-sm text-red-600 mt-1">
                  Emergency appointments are for today only
                </p>
              </div>
              
              <div>
                <Label htmlFor="time" className="text-sm font-medium">
                  Available Time Slots <span className="text-red-500">*</span>
                </Label>
                <Select
                  onValueChange={(value) => setFormData(prev => ({ ...prev, time: value }))}
                  value={formData.time}
                  disabled={!selectedDoctor || availableTimeSlots.length === 0}
                >
                  <SelectTrigger className={`${errors.time ? 'border-red-300' : ''}`}>
                    <SelectValue placeholder={
                      !selectedDoctor 
                        ? "Select a doctor first" 
                        : availableTimeSlots.length === 0 
                          ? "No available slots" 
                          : "Select a time"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTimeSlots.length === 0 && selectedDoctor ? (
                      <SelectItem value="none" disabled>
                        No available slots for today
                      </SelectItem>
                    ) : (
                      availableTimeSlots.map(time => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {errors.time && (
                  <p className="text-red-500 text-sm mt-1">{errors.time}</p>
                )}
              </div>
              
              {selectedDoctor && formData.time && (
                <div className="bg-red-50 p-4 rounded-md border border-red-100 mt-4">
                  <h4 className="font-medium text-red-800 flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Emergency Appointment Details
                  </h4>
                  <p className="text-sm text-red-700 mt-1">
                    Your emergency appointment with Dr. {selectedDoctor.name} will be today at {formData.time}.
                  </p>
                  <p className="text-sm text-red-700 mt-1">
                    Estimated wait time: {selectedDoctor.waitTime || 15} minutes
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div className="pt-4">
            <motion.button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-md font-medium
               disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={!selectedDoctor || !formData.time || availableTimeSlots.length === 0}
            >
              Book Emergency Appointment
            </motion.button>
          </div>
          
          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              For non-emergency appointments, please use our{" "}
              <a href="/doctors" className="text-primary hover:underline">
                regular booking system
              </a>
              .
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EmergencyBookingForm;
