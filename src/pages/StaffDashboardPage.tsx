
import RoleLayout from "@/components/RoleLayout";
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Users, Fingerprint, Clock, UserRound, Calendar, GraduationCap, FileSpreadsheet
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const StaffDashboardPage = () => {
  const { user } = useAuth();

  return (
    <RoleLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight text-staff-primary">Staff Dashboard</h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-staff-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <UserRound className="mr-2 h-4 w-4 text-staff-primary" />
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="h-14 w-14 rounded-full bg-staff-accent flex items-center justify-center text-staff-primary text-lg font-semibold">
                  {user?.name.charAt(0)}
                </div>
                <div>
                  <p className="text-lg font-bold">{user?.name}</p>
                  <p className="text-sm text-muted-foreground">ID: {user?.staffId}</p>
                  <p className="text-sm text-muted-foreground">{user?.department}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-staff-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <GraduationCap className="mr-2 h-4 w-4 text-staff-primary" />
                Students
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-2xl font-bold">45</p>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                </div>
                <Link to="/staff/students">
                  <Button size="sm" variant="outline" className="text-staff-primary border-staff-primary/20 hover:bg-staff-accent/20">
                    View Details
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2">
                <div className="text-center p-2 bg-green-50 rounded-md">
                  <p className="text-lg font-semibold">37</p>
                  <p className="text-xs text-muted-foreground">Present Today</p>
                </div>
                <div className="text-center p-2 bg-red-50 rounded-md">
                  <p className="text-lg font-semibold">5</p>
                  <p className="text-xs text-muted-foreground">Absent</p>
                </div>
                <div className="text-center p-2 bg-yellow-50 rounded-md">
                  <p className="text-lg font-semibold">3</p>
                  <p className="text-xs text-muted-foreground">Leave</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-staff-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Clock className="mr-2 h-4 w-4 text-staff-primary" />
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
                  <div className="text-xs bg-staff-accent px-2 py-1 rounded flex items-center">
                    {class_.time}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-staff-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Fingerprint className="mr-2 h-5 w-5 text-staff-primary" />
                <span>My Attendance</span>
              </CardTitle>
              <CardDescription>Your personal attendance records</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>This Month</span>
                  <span className="font-medium">92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
              
              <div className="space-y-4">
                {[
                  { date: "Today, 08:45 AM", status: "Checked In" },
                  { date: "Yesterday, 08:40 AM", status: "Checked In" },
                  { date: "Yesterday, 05:30 PM", status: "Checked Out" },
                  { date: "Apr 7, 08:50 AM", status: "Checked In" },
                  { date: "Apr 7, 05:45 PM", status: "Checked Out" },
                ].map((record, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="min-w-8 w-8 h-8 rounded-full bg-staff-accent flex items-center justify-center">
                      <Fingerprint className="h-4 w-4 text-staff-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{record.status}</p>
                      <p className="text-xs text-muted-foreground">{record.date}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Link to="/staff/attendance">
                <Button className="w-full bg-staff-primary hover:bg-staff-secondary">
                  Record Attendance
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-staff-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileSpreadsheet className="mr-2 h-5 w-5 text-staff-primary" />
                <span>Courses & Attendance</span>
              </CardTitle>
              <CardDescription>Courses you're teaching and attendance statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { code: "CS301", name: "Database Systems", students: 20, attendance: 90 },
                  { code: "CS302", name: "Web Development", students: 15, attendance: 85 },
                  { code: "CS303", name: "AI Fundamentals", students: 10, attendance: 95 },
                ].map((course, index) => (
                  <div key={index} className="space-y-2 pb-3 border-b last:border-0 last:pb-0">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{course.name}</p>
                        <p className="text-xs text-muted-foreground">{course.code} • {course.students} students</p>
                      </div>
                      <span className="text-sm font-medium bg-staff-accent/30 px-2 rounded">
                        {course.attendance}%
                      </span>
                    </div>
                    <Progress value={course.attendance} className="h-1.5" />
                  </div>
                ))}
                <Link to="/staff/students">
                  <Button variant="outline" className="w-full border-staff-primary/20 text-staff-primary hover:bg-staff-accent/20">
                    View All Student Details
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </RoleLayout>
  );
};

export default StaffDashboardPage;
