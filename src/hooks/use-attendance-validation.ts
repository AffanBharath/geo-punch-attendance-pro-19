
import { useState, useEffect } from 'react';

type AttendanceStatus = 'valid' | 'invalid' | 'upcoming' | 'closed';
type ScheduleType = 'daily' | 'hourly';

interface AttendanceWindow {
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  status: AttendanceStatus;
  label: string;
}

const useDailyAttendanceValidation = (scheduleType: ScheduleType = 'daily') => {
  const [status, setStatus] = useState<AttendanceStatus>('invalid');
  const [currentPeriod, setCurrentPeriod] = useState<string | null>(null);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [attendanceWindows, setAttendanceWindows] = useState<AttendanceWindow[]>([]);

  // Define the daily attendance window (9:00 AM to 9:15 AM)
  const dailyAttendanceWindows: AttendanceWindow[] = [
    {
      startTime: '09:00',
      endTime: '09:15',
      status: 'upcoming',
      label: 'Morning Attendance'
    }
  ];

  // Define hourly attendance windows
  const hourlyAttendanceWindows: AttendanceWindow[] = [
    {
      startTime: '09:00',
      endTime: '09:15',
      status: 'upcoming',
      label: 'Period 1 Attendance'
    },
    {
      startTime: '10:00',
      endTime: '10:15',
      status: 'upcoming',
      label: 'Period 2 Attendance'
    },
    {
      startTime: '11:00',
      endTime: '11:15', 
      status: 'upcoming',
      label: 'Period 3 Attendance'
    },
    // Lunch break 11:15 to 12:15
    {
      startTime: '12:15',
      endTime: '12:30',
      status: 'upcoming',
      label: 'Period 4 Attendance'
    },
    {
      startTime: '13:15',
      endTime: '13:30',
      status: 'upcoming',
      label: 'Period 5 Attendance'
    },
    {
      startTime: '14:15',
      endTime: '14:30',
      status: 'upcoming',
      label: 'Period 6 Attendance'
    },
    {
      startTime: '15:15',
      endTime: '15:30',
      status: 'upcoming',
      label: 'Period 7 Attendance'
    }
  ];

  // Check if current time is within attendance window
  useEffect(() => {
    const windows = scheduleType === 'daily' ? dailyAttendanceWindows : hourlyAttendanceWindows;
    setAttendanceWindows(windows);

    const interval = setInterval(() => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentTimeStr = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
      
      // Check each window
      let isWithinAnyWindow = false;
      let activeWindowLabel = null;
      let minTimeRemaining = Infinity;
      
      const updatedWindows = windows.map(window => {
        const [startHour, startMinute] = window.startTime.split(':').map(Number);
        const [endHour, endMinute] = window.endTime.split(':').map(Number);
        
        const startDate = new Date(now);
        startDate.setHours(startHour, startMinute, 0, 0);
        
        const endDate = new Date(now);
        endDate.setHours(endHour, endMinute, 0, 0);
        
        const timeUntilStart = startDate.getTime() - now.getTime();
        const timeUntilEnd = endDate.getTime() - now.getTime();
        
        let windowStatus: AttendanceStatus = 'invalid';
        
        // If current time is before start time
        if (timeUntilStart > 0) {
          windowStatus = 'upcoming';
          if (timeUntilStart < minTimeRemaining) {
            minTimeRemaining = timeUntilStart;
          }
        }
        // If current time is within window
        else if (timeUntilEnd > 0) {
          windowStatus = 'valid';
          isWithinAnyWindow = true;
          activeWindowLabel = window.label;
          minTimeRemaining = timeUntilEnd;
        }
        // If current time is after end time
        else {
          windowStatus = 'closed';
        }
        
        return {
          ...window,
          status: windowStatus
        };
      });
      
      setAttendanceWindows(updatedWindows);
      setStatus(isWithinAnyWindow ? 'valid' : 'invalid');
      setCurrentPeriod(activeWindowLabel);
      setRemainingTime(minTimeRemaining);
      
    }, 1000);
    
    return () => clearInterval(interval);
  }, [scheduleType]);

  return {
    isValidTime: status === 'valid',
    status,
    currentPeriod,
    remainingTime,
    attendanceWindows,
    formatRemainingTime: (ms: number) => {
      if (ms === Infinity) return '--:--';
      const minutes = Math.floor(ms / 60000);
      const seconds = Math.floor((ms % 60000) / 1000);
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
  };
};

export default useDailyAttendanceValidation;
