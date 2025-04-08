
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import { CalendarIcon, ClockIcon, FileText, MapPinIcon, UserRound } from "lucide-react";

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
  
  useEffect(() => {
    // Get user data from localStorage
    const storedUser = localStorage.getItem('geoAttendanceUser');
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
    
    // Update time
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
              <Avatar className="h-20 w-20">
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
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
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
                  ${((attendance.present / attendance.total) * 3000).toFixed(2)} / ${3000.toFixed(2)}
                </p>
              </div>
              <Progress value={(attendance.present / attendance.total) * 100} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <p>Base Salary</p>
                <p className="font-medium">$3,000.00</p>
              </div>
              <div className="flex items-center justify-between text-sm">
                <p>Attendance Deduction</p>
                <p className="font-medium">-${((attendance.absent / attendance.total) * 3000).toFixed(2)}</p>
              </div>
              <div className="flex items-center justify-between text-sm">
                <p>Estimated Net</p>
                <p className="font-medium">${((attendance.present / attendance.total) * 3000).toFixed(2)}</p>
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
    </div>
  );
};

export default Dashboard;
