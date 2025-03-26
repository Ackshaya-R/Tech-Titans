import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar } from 'lucide-react';
import { format, differenceInMinutes } from 'date-fns';

interface EstimatedTimeProps {
  appointmentDate?: string;
  appointmentTime?: string;
  waitTime?: number;
}

const EstimatedTime = ({ appointmentDate, appointmentTime, waitTime }: EstimatedTimeProps) => {
  const [remainingMinutes, setRemainingMinutes] = useState(0);
  const [progress, setProgress] = useState(100);
  
  useEffect(() => {
    if (!appointmentDate || !appointmentTime) {
      return;
    }
    
    const appointmentDateTime = new Date(`${appointmentDate}T${convertTo24Hour(appointmentTime)}`);
    const now = new Date();
    
    const minutesDifference = differenceInMinutes(appointmentDateTime, now);
    const initialMinutes = Math.max(minutesDifference, 0);
    
    setRemainingMinutes(initialMinutes);
    
    const maxWaitTime = 1440;
    const initialProgress = Math.min((initialMinutes / maxWaitTime) * 100, 100);
    setProgress(initialProgress);
    
    const interval = setInterval(() => {
      const now = new Date();
      const updatedMinutes = differenceInMinutes(appointmentDateTime, now);
      
      if (updatedMinutes <= 0) {
        clearInterval(interval);
        setRemainingMinutes(0);
        setProgress(0);
      } else {
        setRemainingMinutes(updatedMinutes);
        setProgress((updatedMinutes / maxWaitTime) * 100);
      }
    }, 60000);
    
    return () => clearInterval(interval);
  }, [appointmentDate, appointmentTime]);
  
  const convertTo24Hour = (time12h: string | undefined): string => {
    if (!time12h) return "00:00";
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    
    if (hours === '12') {
      hours = '00';
    }
    
    if (modifier === 'PM') {
      hours = String(parseInt(hours, 10) + 12);
    }
    
    return `${hours.padStart(2, '0')}:${minutes}`;
  };
  
  const formatTimeRemaining = () => {
    if (remainingMinutes <= 0) {
      return 'It\'s appointment time!';
    }
    
    const days = Math.floor(remainingMinutes / 1440);
    const hours = Math.floor((remainingMinutes % 1440) / 60);
    const minutes = remainingMinutes % 60;
    
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-border p-4 shadow-card">
      <h3 className="text-base font-medium mb-3 flex items-center">
        <Clock className="w-4 h-4 mr-2 text-primary" />
        Time Until Appointment
      </h3>
      
      {waitTime !== undefined ? (
        <div className="mt-4 text-center">
          <span className="text-2xl font-bold text-primary">
            {waitTime === 0 ? "No waiting time" : `${waitTime} minutes wait`}
          </span>
          <p className="text-xs text-muted-foreground mt-2">
            Estimated waiting time at the clinic
          </p>
        </div>
      ) : appointmentDate && appointmentTime ? (
        <>
          <div className="flex items-center mb-4">
            <Calendar className="w-4 h-4 mr-2 text-primary" />
            <span className="text-sm">
              {format(new Date(appointmentDate), 'MMMM d, yyyy')} at {appointmentTime}
            </span>
          </div>
          
          <div className="relative pt-1">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-xs font-medium text-primary inline-block py-1">
                  Current Time
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-medium text-primary inline-block">
                  Appointment Time
                </span>
              </div>
            </div>
            
            <div className="relative">
              <div className="overflow-hidden h-2 text-xs flex rounded bg-primary/10">
                <motion.div 
                  style={{ width: `${progress}%` }} 
                  className="bg-primary h-full rounded"
                  initial={{ width: "100%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              
              <motion.div 
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-primary rounded-full shadow"
                style={{ left: `calc(${progress}% - 8px)` }}
                initial={{ left: "calc(100% - 8px)" }}
                animate={{ left: `calc(${progress}% - 8px)` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <span className="text-2xl font-bold text-primary">{formatTimeRemaining()}</span>
            
            <p className="text-xs text-muted-foreground mt-2">
              {remainingMinutes <= 0 
                ? "Your appointment is now!" 
                : "Time remaining until your appointment"}
            </p>
          </div>
        </>
      ) : (
        <div className="text-center py-4">
          <p className="text-muted-foreground">Appointment details not available</p>
        </div>
      )}
    </div>
  );
};

export default EstimatedTime;
