
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
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Doctor, LocationType } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import EstimatedTime from './EstimatedTime';
import { toast } from 'sonner';

// Create an interface that extends jsPDF with the lastAutoTable property
interface ExtendedJsPDF extends jsPDF {
  lastAutoTable?: {
    finalY: number;
  };
}

interface AppointmentData {
  name: string;
  email?: string;
  phone: string;
  date: string;
  time: string;
  reason?: string;
  appointmentNumber: number;
  waitTime: number;
  fee: number;
  isEmergency?: boolean;
}

interface AppointmentConfirmationProps {
  doctor: Doctor;
  locationData: LocationType;
  appointment: AppointmentData;
}

const AppointmentConfirmation = ({ doctor, locationData, appointment }: AppointmentConfirmationProps) => {
  const { toast: showToast } = useToast();
  const ticketRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    showToast({
      title: appointment.isEmergency ? "Emergency Appointment Confirmed!" : "Appointment Confirmed!",
      description: `Your appointment with Dr. ${doctor.name} has been successfully booked.`,
      duration: 5000,
    });
  }, []);
  
  const handleDownloadTicket = () => {
    // Cast the jsPDF instance to our extended interface
    const doc = new jsPDF() as ExtendedJsPDF;
    
    // Add header with logo
    doc.setFontSize(22);
    doc.setTextColor(41, 98, 255);
    doc.text("DocFinder", 105, 20, { align: "center" });
    
    // Change title color to red for emergency appointments
    if (appointment.isEmergency) {
      doc.setTextColor(220, 38, 38); // red-600
      doc.text("EMERGENCY APPOINTMENT", 105, 30, { align: "center" });
    } else {
      doc.setTextColor(0, 0, 0);
      doc.text("Appointment Confirmation", 105, 30, { align: "center" });
    }
    
    // Add appointment details
    doc.setFontSize(14);
    doc.text(`Appointment #${appointment.appointmentNumber}`, 15, 40);
    
    doc.setFontSize(12);
    doc.text(`Doctor: Dr. ${doctor.name}`, 15, 50);
    doc.text(`Specialty: ${specialtyName(doctor.specialty)}`, 15, 57);
    
    // Patient Details
    // Define header color as a tuple with exactly 3 elements for TypeScript
    const headerColor: [number, number, number] = appointment.isEmergency ? [220, 38, 38] : [41, 98, 255];
    
    doc.setFillColor(240, 240, 255);
    autoTable(doc, {
      head: [['Patient Information']],
      body: [
        ['Name', appointment.name || 'Not provided'],
        ['Email', appointment.email || 'Not provided'],
        ['Phone', appointment.phone || 'Not provided'],
      ],
      startY: 65,
      headStyles: { fillColor: headerColor },
    });
    
    // Safely access lastAutoTable property
    const finalY1 = doc.lastAutoTable?.finalY || 100;
    
    // Appointment Details
    autoTable(doc, {
      head: [['Appointment Details']],
      body: [
        ['Date', formatDate(appointment.date)],
        ['Time', appointment.time],
        ['Location', `${locationData.area}, ${locationData.district}, ${locationData.state}`],
        ['Consultation Fee', `₹${appointment.fee}`],
        ['Estimated Wait Time', `${appointment.waitTime} minutes`],
        ['Reason for Visit', appointment.reason || 'Not specified'],
        appointment.isEmergency ? ['Appointment Type', 'EMERGENCY'] : ['Appointment Type', 'Regular'],
      ],
      startY: finalY1 + 10,
      headStyles: { fillColor: headerColor },
    });
    
    // Important Notes
    const finalY2 = doc.lastAutoTable?.finalY || 200;
    
    // Important notes color (red for emergency)
    if (appointment.isEmergency) {
      doc.setTextColor(220, 38, 38);
    } else {
      doc.setTextColor(180, 80, 80);
    }
    
    doc.setFontSize(12);
    doc.text("Important Notes:", 15, finalY2 + 20);
    
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(10);
    
    const notes = appointment.isEmergency 
      ? [
          "Please arrive immediately for your emergency appointment",
          "Bring your ID and any medical records related to your emergency",
          `Consultation fee of ₹${appointment.fee} is payable at the clinic`,
          "Our staff will prioritize your emergency case"
        ]
      : [
          "Please arrive 15 minutes before your appointment time",
          "Bring your ID and medical records if applicable",
          `Consultation fee of ₹${appointment.fee} is payable at the clinic`,
          "Rescheduling requires 24 hours advance notice"
        ];
    
    notes.forEach((note, i) => {
      doc.text(`• ${note}`, 20, finalY2 + 30 + (i * 7));
    });
    
    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Generated by DocFinder on ${new Date().toLocaleDateString()}`,
        105,
        doc.internal.pageSize.height - 10,
        { align: "center" }
      );
    }
    
    // Save PDF with appropriate filename
    const filename = appointment.isEmergency 
      ? `emergency-appointment-${appointment.appointmentNumber}.pdf`
      : `appointment-${appointment.appointmentNumber}.pdf`;
      
    doc.save(filename);
    
    toast.success("E-Ticket PDF downloaded successfully");
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

  // Set color theme based on appointment type
  const headerBgColor = appointment.isEmergency ? "bg-red-50" : "bg-green-50";
  const headerBorderColor = appointment.isEmergency ? "border-red-100" : "border-green-100";
  const headerTextColor = appointment.isEmergency ? "text-red-800" : "text-green-800";
  const headerDescColor = appointment.isEmergency ? "text-red-700" : "text-green-700";
  const iconColor = appointment.isEmergency ? "text-red-600" : "text-green-600";
  
  return (
    <div className="w-full max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-xl shadow-card overflow-hidden border border-border"
      >
        <div className={`${headerBgColor} p-6 border-b ${headerBorderColor} flex items-center`}>
          <div className={`${appointment.isEmergency ? "bg-red-100" : "bg-green-100"} rounded-full p-2 mr-4`}>
            <Check className={`w-6 h-6 ${iconColor}`} />
          </div>
          <div>
            <h2 className={`text-xl font-semibold ${headerTextColor}`}>
              {appointment.isEmergency ? "Emergency Appointment Confirmed!" : "Appointment Confirmed!"}
            </h2>
            <p className={`${headerDescColor} mt-1`}>
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
                  className={appointment.isEmergency ? "bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md flex items-center" : "button-primary"}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download E-Ticket (PDF)
                </button>
              </div>
            </div>
            
            <div className="md:w-1/3">
              <EstimatedTime waitTime={appointment.waitTime} />
            </div>
          </div>
          
          <div ref={ticketRef} className={`border-2 border-dashed ${appointment.isEmergency ? "border-red-300 bg-red-50/30" : "border-primary/30 bg-primary/5"} rounded-lg p-6`}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold mb-1">Dr. {doctor.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {specialtyName(doctor.specialty)}
                </p>
              </div>
              
              <div className={`${appointment.isEmergency ? "bg-red-600" : "bg-primary"} rounded-lg p-2 text-white font-bold text-center`}>
                <div className="text-xs uppercase">Appt#</div>
                <div>{appointment.appointmentNumber}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <Calendar className={`w-5 h-5 ${appointment.isEmergency ? "text-red-500" : "text-primary"} mr-3 flex-shrink-0 mt-0.5`} />
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">{formatDate(appointment.date)}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className={`w-5 h-5 ${appointment.isEmergency ? "text-red-500" : "text-primary"} mr-3 flex-shrink-0 mt-0.5`} />
                  <div>
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="font-medium">{appointment.time}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className={`w-5 h-5 ${appointment.isEmergency ? "text-red-500" : "text-primary"} mr-3 flex-shrink-0 mt-0.5`} />
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
                  <User className={`w-5 h-5 ${appointment.isEmergency ? "text-red-500" : "text-primary"} mr-3 flex-shrink-0 mt-0.5`} />
                  <div>
                    <p className="text-sm text-muted-foreground">Patient Name</p>
                    <p className="font-medium">{appointment.name}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className={`w-5 h-5 ${appointment.isEmergency ? "text-red-500" : "text-primary"} mr-3 flex-shrink-0 mt-0.5`} />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{appointment.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className={`w-5 h-5 ${appointment.isEmergency ? "text-red-500" : "text-primary"} mr-3 flex-shrink-0 mt-0.5`} />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{appointment.email || "Not provided"}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-border">
              <h4 className="font-medium mb-2">Appointment Details</h4>
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Consultation Fee</span>
                  <span className="font-medium">₹{appointment.fee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Date & Time</span>
                  <span className="font-medium">{formatDateShort(appointment.date)} - {appointment.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Appointment #</span>
                  <span className="font-medium">{appointment.appointmentNumber}</span>
                </div>
                {appointment.isEmergency && (
                  <div className="flex justify-between">
                    <span className="text-sm text-red-500 font-medium">EMERGENCY APPOINTMENT</span>
                    <span className="font-medium text-red-500">Priority Care</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Verified by</p>
                  <p className="font-medium">DocFinder Booking System</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Booked on</p>
                  <p className="font-medium">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <div className={`${appointment.isEmergency ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"} border rounded-lg p-4`}>
              <h4 className={`font-medium ${appointment.isEmergency ? "text-red-800" : "text-amber-800"} mb-2`}>
                {appointment.isEmergency ? "Emergency Instructions" : "Important Notes"}
              </h4>
              <ul className={`list-disc list-inside text-sm ${appointment.isEmergency ? "text-red-700" : "text-amber-700"} space-y-1`}>
                {appointment.isEmergency ? (
                  <>
                    <li>Please arrive immediately for your emergency appointment</li>
                    <li>Bring your ID and any medical records related to your emergency</li>
                    <li>Consultation fee of ₹{appointment.fee} is payable at the clinic</li>
                    <li>Our staff will prioritize your emergency case</li>
                  </>
                ) : (
                  <>
                    <li>Please arrive 15 minutes before your appointment time</li>
                    <li>Bring your ID and medical records if applicable</li>
                    <li>Consultation fee of ₹{appointment.fee} is payable at the clinic</li>
                    <li>Rescheduling requires 24 hours advance notice</li>
                  </>
                )}
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
