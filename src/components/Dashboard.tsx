
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import { CalendarIcon, ClockIcon, FileText, MapPinIcon, UserRound } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  joinDate: string;
}

const Dashboard = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [attendance, setAttendance] = useState({
    present: 18,
    absent: 2,
    leave: 1,
    total: 21,
    streak: 5,
  });
  
  // Add state for dialogs
  const [userProfileOpen, setUserProfileOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  
  useEffect(() => {
    const storedUser = localStorage.getItem('geoAttendanceUser');
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const initials = userData?.name
    ? userData.name
        .split(' ')
        .map((n) => n[0])
        .join('')
    : 'U';

  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  // Calculate salary values
  const salaryBase = 3000;
  const earnedSalary = (attendance.present / attendance.total) * salaryBase;
  const deduction = (attendance.absent / attendance.total) * salaryBase;

  // Generate current month days for calendar view
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  // Get days in current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  // Generate array of present/absent days for the month
  const generateMonthData = () => {
    const monthDays = [];
    for (let i = 1; i <= daysInMonth; i++) {
      // For demo purposes, let's say weekends are absent, and a few random days are leave
      const day = new Date(currentYear, currentMonth, i);
      const isWeekend = day.getDay() === 0 || day.getDay() === 6;
      const isLeave = i === 15 || i === 16; // Example leave days
      const status = isLeave ? 'leave' : isWeekend ? 'absent' : 'present';
      
      monthDays.push({
        date: i,
        status,
        dayName: day.toLocaleDateString('en-US', { weekday: 'short' })
      });
    }
    return monthDays;
  };
  
  const monthData = generateMonthData();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">{formattedDate}</p>
            <p className="font-medium">{formattedTime}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Profile</CardTitle>
            <UserRound className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Avatar 
                className="h-20 w-20 cursor-pointer hover:opacity-80 transition-opacity" 
                onClick={() => setUserProfileOpen(true)}
              >
                <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-2xl font-bold">{userData?.name || "User"}</p>
                <p className="text-sm text-muted-foreground">{userData?.role || "Role"} - {userData?.department || "Department"}</p>
                <p className="text-sm text-muted-foreground">ID: {userData?.id || "0000"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Attendance Status</CardTitle>
            <CalendarIcon 
              className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-primary transition-colors" 
              onClick={() => setCalendarOpen(true)}
            />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Present</p>
                <p className="text-sm font-medium">{attendance.present}/{attendance.total} days</p>
              </div>
              <Progress value={(attendance.present / attendance.total) * 100} className="h-2" />
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-1">
                <p className="text-2xl font-bold">{attendance.present}</p>
                <p className="text-xs text-muted-foreground">Present</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold">{attendance.absent}</p>
                <p className="text-xs text-muted-foreground">Absent</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold">{attendance.leave}</p>
                <p className="text-xs text-muted-foreground">Leave</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <p className="text-sm">Current Streak</p>
              <p className="text-sm font-bold">{attendance.streak} days</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Monthly Summary</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm">Salary Progress</p>
                <p className="text-sm font-medium">
                  ${earnedSalary.toFixed(2)} of ${salaryBase.toFixed(2)}
                </p>
              </div>
              <Progress value={(attendance.present / attendance.total) * 100} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <p>Base Salary</p>
                <p className="font-medium">${salaryBase.toFixed(2)}</p>
              </div>
              <div className="flex items-center justify-between text-sm">
                <p>Attendance Deduction</p>
                <p className="font-medium">-${deduction.toFixed(2)}</p>
              </div>
              <div className="flex items-center justify-between text-sm">
                <p>Estimated Net</p>
                <p className="font-medium">${earnedSalary.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Your latest attendance records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { date: "Today, 09:15 AM", status: "Checked In", location: "Main Office" },
              { date: "Yesterday, 06:00 PM", status: "Checked Out", location: "Main Office" },
              { date: "Yesterday, 09:05 AM", status: "Checked In", location: "Main Office" },
              { date: "Apr 6, 06:10 PM", status: "Checked Out", location: "Main Office" },
              { date: "Apr 6, 09:10 AM", status: "Checked In", location: "Main Office" },
            ].map((record, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="min-w-10 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  {record.status.includes("In") ? (
                    <ClockIcon className="h-5 w-5 text-green-500" />
                  ) : (
                    <ClockIcon className="h-5 w-5 text-blue-500" />
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">{record.status}</p>
                  <div className="flex items-center text-xs text-muted-foreground space-x-2">
                    <span>{record.date}</span>
                    <span>•</span>
                    <div className="flex items-center">
                      <MapPinIcon className="h-3 w-3 mr-1" />
                      <span>{record.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User Profile Dialog */}
      <Dialog open={userProfileOpen} onOpenChange={setUserProfileOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
            <DialogDescription>
              Detailed information about your profile
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex justify-center">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="space-y-3">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                <p className="font-medium">{userData?.name || "Not provided"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="font-medium">{userData?.email || "Not provided"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Employee ID</p>
                <p className="font-medium">{userData?.id || "Not provided"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Role</p>
                <p className="font-medium">{userData?.role || "Not provided"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Department</p>
                <p className="font-medium">{userData?.department || "Not provided"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Join Date</p>
                <p className="font-medium">{userData?.joinDate || "Not provided"}</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Calendar Dialog */}
      <Dialog open={calendarOpen} onOpenChange={setCalendarOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{currentTime.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} Attendance</DialogTitle>
            <DialogDescription>
              Your attendance record for the current month
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-7 gap-1 text-center">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-xs font-medium text-muted-foreground p-2">
                  {day}
                </div>
              ))}
              
              {/* Fill in empty spaces for first week */}
              {Array.from({ length: new Date(currentYear, currentMonth, 1).getDay() }).map((_, i) => (
                <div key={`empty-${i}`} className="p-2"></div>
              ))}
              
              {/* Render days */}
              {monthData.map((day) => (
                <div 
                  key={day.date} 
                  className={`text-xs p-2 rounded-full flex items-center justify-center aspect-square ${
                    day.status === 'present' ? 'bg-green-100 text-green-700' : 
                    day.status === 'absent' ? 'bg-red-100 text-red-700' : 
                    'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {day.date}
                </div>
              ))}
            </div>
            
            <div className="flex justify-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-100"></div>
                <span className="text-xs">Present</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-100"></div>
                <span className="text-xs">Absent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-100"></div>
                <span className="text-xs">Leave</span>
              </div>
            </div>
            
            <div className="pt-2">
              <div className="flex justify-between text-sm">
                <span>Total Working Days:</span>
                <span className="font-medium">{attendance.total}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Present Days:</span>
                <span className="font-medium text-green-600">{attendance.present}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Absent Days:</span>
                <span className="font-medium text-red-600">{attendance.absent}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Leave Days:</span>
                <span className="font-medium text-yellow-600">{attendance.leave}</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
