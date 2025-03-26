
import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  Download, 
  Check
} from 'lucide-react';
import type { Doctor, LocationType } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import EstimatedTime from './EstimatedTime';

interface AppointmentData {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  reason: string;
  appointmentNumber: number;
  waitTime: number;
  fee: number;
}

interface AppointmentConfirmationProps {
  doctor: Doctor;
  locationData: LocationType;
  appointment: AppointmentData;
}

const AppointmentConfirmation = ({ doctor, locationData, appointment }: AppointmentConfirmationProps) => {
  const { toast } = useToast();
  const ticketRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    toast({
      title: "Appointment Confirmed!",
      description: `Your appointment with ${doctor.name} has been successfully booked.`,
      duration: 5000,
    });
  }, []);
  
  const handleDownloadTicket = () => {
    // In a real app, we would generate a PDF or image here
    toast({
      title: "E-Ticket Downloaded",
      description: "Your appointment e-ticket has been saved to your device.",
      duration: 3000,
    });
  };
  
  // Format date: "Monday, June 10, 2023"
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  const formatDateShort = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-xl shadow-card overflow-hidden border border-border"
      >
        <div className="bg-green-50 p-6 border-b border-green-100 flex items-center">
          <div className="bg-green-100 rounded-full p-2 mr-4">
            <Check className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-green-800">
              Appointment Confirmed!
            </h2>
            <p className="text-green-700 mt-1">
              Your appointment has been successfully booked
            </p>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col-reverse md:flex-row items-start md:items-center gap-6 mb-8">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Appointment #{appointment.appointmentNumber}
              </h3>
              <p className="text-muted-foreground mb-4">
                Please show this e-ticket at the reception
              </p>
              
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={handleDownloadTicket}
                  className="button-primary"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download E-Ticket
                </button>
              </div>
            </div>
            
            <div className="md:w-1/3">
              <EstimatedTime waitTime={appointment.waitTime} />
            </div>
          </div>
          
          <div ref={ticketRef} className="border-2 border-dashed border-primary/30 rounded-lg p-6 bg-primary/5">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold mb-1">{doctor.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {specialtyName(doctor.specialty)}
                </p>
              </div>
              
              <div className="bg-primary rounded-lg p-2 text-white font-bold text-center">
                <div className="text-xs uppercase">Appt#</div>
                <div>{appointment.appointmentNumber}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <Calendar className="w-5 h-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">{formatDate(appointment.date)}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="font-medium">{appointment.time}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">
                      {locationData.area}, {locationData.district}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <User className="w-5 h-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Patient Name</p>
                    <p className="font-medium">{appointment.name}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="w-5 h-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{appointment.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="w-5 h-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{appointment.email}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-border">
              <h4 className="font-medium mb-2">Appointment Details</h4>
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Consultation Fee</span>
                  <span className="font-medium">${appointment.fee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Date & Time</span>
                  <span className="font-medium">{formatDateShort(appointment.date)} - {appointment.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Appointment #</span>
                  <span className="font-medium">{appointment.appointmentNumber}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Verified by</p>
                  <p className="font-medium">DocSchedule Booking System</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Booked on</p>
                  <p className="font-medium">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h4 className="font-medium text-amber-800 mb-2">Important Notes</h4>
              <ul className="list-disc list-inside text-sm text-amber-700 space-y-1">
                <li>Please arrive 15 minutes before your appointment time</li>
                <li>Bring your ID and medical records if applicable</li>
                <li>Consultation fee of ${appointment.fee} is payable at the clinic</li>
                <li>Rescheduling requires 24 hours advance notice</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Helper function to map specialty ID to name
const specialtyName = (id: string): string => {
  const specialtyMap: Record<string, string> = {
    neurologist: 'Neurologist',
    cardiologist: 'Cardiologist',
    dermatologist: 'Dermatologist',
    orthopedist: 'Orthopedist',
    ophthalmologist: 'Ophthalmologist',
    pediatrician: 'Pediatrician',
    psychiatrist: 'Psychiatrist',
    gynecologist: 'Gynecologist',
  };
  
  return specialtyMap[id] || id;
};

export default AppointmentConfirmation;
