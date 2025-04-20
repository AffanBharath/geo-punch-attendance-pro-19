
import { useState } from "react";
import RoleLayout from "@/components/RoleLayout";
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, Fingerprint, Clock, UserRound, Calendar
} from "lucide-react";
import { useAuth, AppUser } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";

const StudentDashboardPage = () => {
  const { user } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [attendanceOpen, setAttendanceOpen] = useState(false);
  
  // Dummy attendance data for the current month
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  const generateMonthData = () => {
    const monthDays = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const day = new Date(currentYear, currentMonth, i);
      const isWeekend = day.getDay() === 0 || day.getDay() === 6;
      const isLeave = i === 15 || i === 16;
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
  const attendance = {
    present: 145,
    absent: 18,
    leave: 7,
    total: 170
  };

  // The user's initial if available, or a fallback
  const userInitial = user?.name ? user.name.charAt(0) : 'S';

  return (
    <RoleLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight text-student-primary">Student Dashboard</h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-student-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <UserRound className="mr-2 h-4 w-4 text-student-primary" />
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 cursor-pointer" onClick={() => setProfileOpen(true)}>
                <div className="h-14 w-14 rounded-full bg-student-accent flex items-center justify-center text-student-primary text-lg font-semibold">
                  {userInitial}
                </div>
                <div>
                  <p className="text-lg font-bold">{user?.name || "Student"}</p>
                  <p className="text-sm text-muted-foreground">ID: {user?.studentId || "N/A"}</p>
                  <p className="text-sm text-muted-foreground">{user?.department || "Department"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-student-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Fingerprint 
                  className="mr-2 h-4 w-4 text-student-primary cursor-pointer" 
                  onClick={() => setAttendanceOpen(true)}
                />
                Attendance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Attendance</span>
                <span className="font-medium">85%</span>
              </div>
              <Progress value={85} className="h-2" />
              <div className="grid grid-cols-3 gap-2 pt-2 cursor-pointer" onClick={() => setAttendanceOpen(true)}>
                <div className="text-center p-2 bg-student-accent/20 rounded-md">
                  <p className="text-lg font-semibold">145</p>
                  <p className="text-xs text-muted-foreground">Present</p>
                </div>
                <div className="text-center p-2 bg-red-50 rounded-md">
                  <p className="text-lg font-semibold">18</p>
                  <p className="text-xs text-muted-foreground">Absent</p>
                </div>
                <div className="text-center p-2 bg-yellow-50 rounded-md">
                  <p className="text-lg font-semibold">7</p>
                  <p className="text-xs text-muted-foreground">Leave</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-student-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Clock className="mr-2 h-4 w-4 text-student-primary" />
                Today's Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { time: "09:00 - 10:30", subject: "Database Systems", room: "CS-101" },
                { time: "11:00 - 12:30", subject: "Web Development", room: "CS-203" },
                { time: "14:00 - 15:30", subject: "AI Fundamentals", room: "CS-305" },
              ].map((class_, index) => (
                <div key={index} className="flex justify-between pb-2 border-b last:border-0">
                  <div>
                    <p className="font-medium text-sm">{class_.subject}</p>
                    <p className="text-xs text-muted-foreground">Room {class_.room}</p>
                  </div>
                  <div className="text-xs bg-student-accent px-2 py-1 rounded flex items-center">
                    {class_.time}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-student-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="mr-2 h-5 w-5 text-student-primary" />
                <span>Current Courses</span>
              </CardTitle>
              <CardDescription>Your enrolled courses this semester</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { code: "CS301", name: "Database Systems", attendance: 90 },
                  { code: "CS302", name: "Web Development", attendance: 85 },
                  { code: "CS303", name: "AI Fundamentals", attendance: 78 },
                  { code: "CS304", name: "Mobile Application Development", attendance: 92 },
                  { code: "CS305", name: "Computer Networks", attendance: 80 },
                ].map((course, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{course.name}</p>
                      <p className="text-sm text-muted-foreground">{course.code}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24">
                        <Progress value={course.attendance} className="h-2" />
                      </div>
                      <span className="text-sm font-medium">{course.attendance}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-student-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-student-primary" />
                <span>Recent Activity</span>
              </CardTitle>
              <CardDescription>Your recent attendance records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { date: "Today, 08:55 AM", status: "Checked In", subject: "Database Systems" },
                  { date: "Yesterday, 08:50 AM", status: "Checked In", subject: "Web Development" },
                  { date: "Yesterday, 01:58 PM", status: "Checked In", subject: "AI Fundamentals" },
                  { date: "Apr 7, 09:02 AM", status: "Checked In", subject: "Mobile App Dev" },
                  { date: "Apr 7, 01:55 PM", status: "Checked In", subject: "Computer Networks" },
                ].map((record, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="min-w-8 w-8 h-8 rounded-full bg-student-accent flex items-center justify-center">
                      <Fingerprint className="h-4 w-4 text-student-primary" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <p className="text-sm font-medium">{record.status}</p>
                        <span className="text-xs text-student-primary ml-2 px-2 py-0.5 rounded-full bg-student-accent">
                          {record.subject}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{record.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="border-student-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-student-primary" />
              <span>OD Permission</span>
            </CardTitle>
            <CardDescription>Request and track your on-duty permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-sm">Technical Workshop</h3>
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full font-medium">Pending</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">Apr 15 - Apr 16, 2025</p>
                  <p className="text-xs mb-4">Participation in National Technical Workshop</p>
                  <p className="text-xs text-muted-foreground">Submitted on Apr 10, 2025</p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-sm">Medical Appointment</h3>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full font-medium">Approved</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">Apr 5, 2025</p>
                  <p className="text-xs mb-4">Doctor appointment at city hospital</p>
                  <p className="text-xs text-muted-foreground">Submitted on Apr 2, 2025</p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-sm">Family Function</h3>
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full font-medium">Rejected</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">Mar 25, 2025</p>
                  <p className="text-xs mb-4">Family event in hometown</p>
                  <p className="text-xs text-muted-foreground">Submitted on Mar 20, 2025</p>
                </div>
              </div>
              
              <Link to="/student/od-permission">
                <Button className="w-full bg-student-primary hover:bg-student-primary/90">
                  Manage OD Permissions
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        {/* Profile Dialog */}
        <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Student Profile</DialogTitle>
              <DialogDescription>
                Detailed information about your profile
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex justify-center">
                <div className="h-24 w-24 rounded-full bg-student-accent flex items-center justify-center text-student-primary text-2xl font-semibold">
                  {userInitial}
                </div>
              </div>
              <div className="space-y-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                  <p className="font-medium">{user?.name || "Student Name"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="font-medium">{user?.email || "student@example.com"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Student ID</p>
                  <p className="font-medium">{user?.studentId || "CS2023001"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Department</p>
                  <p className="font-medium">{user?.department || "Computer Science"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Year of Study</p>
                  <p className="font-medium">3rd Year</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Admission Year</p>
                  <p className="font-medium">2023</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Class Counselor</p>
                  <p className="font-medium">Prof. Maria Johnson</p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Attendance Dialog */}
        <Dialog open={attendanceOpen} onOpenChange={setAttendanceOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{format(new Date(), 'MMMM yyyy')} Attendance</DialogTitle>
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
                
                {Array.from({ length: new Date(currentYear, currentMonth, 1).getDay() }).map((_, i) => (
                  <div key={`empty-${i}`} className="p-2"></div>
                ))}
                
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
    </RoleLayout>
  );
};

export default StudentDashboardPage;
