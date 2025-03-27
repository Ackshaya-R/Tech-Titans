
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar } from 'lucide-react';
import { format, differenceInMinutes, differenceInSeconds, parseISO, formatDistanceToNow } from 'date-fns';

interface EstimatedTimeProps {
  appointmentDate?: string;
  appointmentTime?: string;
  waitTime?: number;
  isEmergency?: boolean;
}

const EstimatedTime = ({ appointmentDate, appointmentTime, waitTime, isEmergency = false }: EstimatedTimeProps) => {
  const [remainingTime, setRemainingTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalSeconds: 0
  });
  const [progress, setProgress] = useState(100);
  const [displayDate, setDisplayDate] = useState('');
  
  useEffect(() => {
    if (!appointmentDate || !appointmentTime) {
      return;
    }
    
    const appointmentDateTime = new Date(`${appointmentDate}T${convertTo24Hour(appointmentTime)}`);
    const now = new Date();
    
    // Format the date for display
    setDisplayDate(format(appointmentDateTime, 'MMMM d, yyyy'));
    
    // Calculate initial remaining time
    updateRemainingTime(appointmentDateTime);
    
    // Set up interval to update time
    const interval = setInterval(() => {
      updateRemainingTime(appointmentDateTime);
    }, 1000); // Update every second for more accuracy
    
    return () => clearInterval(interval);
  }, [appointmentDate, appointmentTime]);
  
  const updateRemainingTime = (appointmentDateTime: Date) => {
    const now = new Date();
    const diffInSeconds = Math.max(0, Math.floor((appointmentDateTime.getTime() - now.getTime()) / 1000));
    
    if (diffInSeconds <= 0) {
      setRemainingTime({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        totalSeconds: 0
      });
      setProgress(0);
      return;
    }
    
    const days = Math.floor(diffInSeconds / (3600 * 24));
    const hours = Math.floor((diffInSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((diffInSeconds % 3600) / 60);
    const seconds = diffInSeconds % 60;
    
    setRemainingTime({
      days,
      hours,
      minutes,
      seconds,
      totalSeconds: diffInSeconds
    });
    
    // Calculate progress based on time until appointment (max 24 hours = 86400 seconds)
    const maxWaitTime = 86400; // 24 hours in seconds
    const initialProgress = Math.min((diffInSeconds / maxWaitTime) * 100, 100);
    setProgress(initialProgress);
  };
  
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
    const { days, hours, minutes, seconds, totalSeconds } = remainingTime;
    
    if (totalSeconds <= 0) {
      return 'It\'s appointment time!';
    }
    
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  // Calculate human-readable wait time
  const getHumanReadableTime = () => {
    if (!appointmentDate || !appointmentTime) return '';
    
    const appointmentDateTime = new Date(`${appointmentDate}T${convertTo24Hour(appointmentTime)}`);
    return formatDistanceToNow(appointmentDateTime, { addSuffix: true });
  };

  // Set color theme based on appointment type
  const themeColor = isEmergency ? 'red' : 'primary';
  const bgColor = isEmergency ? 'bg-red-50' : 'bg-white';
  const borderColor = isEmergency ? 'border-red-200' : 'border-border';
  const textColor = isEmergency ? 'text-red-600' : 'text-primary';
  const lightBgColor = isEmergency ? 'bg-red-100/30' : 'bg-primary/10';
  const progressColor = isEmergency ? 'bg-red-500' : 'bg-primary';
  const progressBorderColor = isEmergency ? 'border-red-500' : 'border-primary';

  return (
    <div className={`${bgColor} rounded-xl border ${borderColor} p-4 shadow-card`}>
      <h3 className="text-base font-medium mb-3 flex items-center">
        <Clock className={`w-4 h-4 mr-2 ${textColor}`} />
        Time Until Appointment
      </h3>
      
      {waitTime !== undefined ? (
        <div className="mt-4 text-center">
          <span className={`text-2xl font-bold ${textColor}`}>
            {waitTime === 0 ? "No waiting time" : `${waitTime} minutes wait`}
          </span>
          <p className="text-xs text-muted-foreground mt-2">
            Estimated waiting time at the clinic
          </p>
        </div>
      ) : appointmentDate && appointmentTime ? (
        <>
          <div className="flex items-center mb-4">
            <Calendar className={`w-4 h-4 mr-2 ${textColor}`} />
            <span className="text-sm">
              {displayDate} at {appointmentTime}
            </span>
          </div>
          
          <div className="relative pt-1">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className={`text-xs font-medium ${textColor} inline-block py-1`}>
                  Current Time
                </span>
              </div>
              <div className="text-right">
                <span className={`text-xs font-medium ${textColor} inline-block`}>
                  Appointment Time
                </span>
              </div>
            </div>
            
            <div className="relative">
              <div className={`overflow-hidden h-2 text-xs flex rounded ${lightBgColor}`}>
                <motion.div 
                  style={{ width: `${progress}%` }} 
                  className={`${progressColor} h-full rounded`}
                  initial={{ width: "100%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              
              <motion.div 
                className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 ${progressBorderColor} rounded-full shadow`}
                style={{ left: `calc(${progress}% - 8px)` }}
                initial={{ left: "calc(100% - 8px)" }}
                animate={{ left: `calc(${progress}% - 8px)` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <span className={`text-2xl font-bold ${textColor}`}>{formatTimeRemaining()}</span>
            
            <p className="text-sm text-muted-foreground mt-2">
              {remainingTime.totalSeconds <= 0 
                ? "Your appointment is now!" 
                : `Your appointment is ${getHumanReadableTime()}`}
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
