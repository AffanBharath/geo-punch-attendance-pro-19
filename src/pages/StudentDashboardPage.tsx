
import { useEffect } from "react";
import RoleLayout from "@/components/RoleLayout";
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, Fingerprint, Clock, UserRound, Calendar
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const StudentDashboardPage = () => {
  const { user } = useAuth();

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
              <div className="flex items-center space-x-4">
                <div className="h-14 w-14 rounded-full bg-student-accent flex items-center justify-center text-student-primary text-lg font-semibold">
                  {user?.name.charAt(0)}
                </div>
                <div>
                  <p className="text-lg font-bold">{user?.name}</p>
                  <p className="text-sm text-muted-foreground">ID: {user?.studentId}</p>
                  <p className="text-sm text-muted-foreground">{user?.department}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-student-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Fingerprint className="mr-2 h-4 w-4 text-student-primary" />
                Attendance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Attendance</span>
                <span className="font-medium">85%</span>
              </div>
              <Progress value={85} className="h-2" />
              <div className="grid grid-cols-3 gap-2 pt-2">
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
      </div>
    </RoleLayout>
  );
};

export default StudentDashboardPage;
