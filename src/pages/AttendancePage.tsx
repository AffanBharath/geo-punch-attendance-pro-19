
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AttendanceForm from "@/components/AttendanceForm";
import AttendanceHistory from "@/components/AttendanceHistory";
import DailyAttendance from "@/components/DailyAttendance";
import HourlyAttendance from "@/components/HourlyAttendance";
import { useAuth } from "@/contexts/AuthContext";

const AttendancePage = () => {
  const { role } = useAuth();

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
        
        <Tabs defaultValue="punch" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="punch">Punch In/Out</TabsTrigger>
            <TabsTrigger value="daily">Daily Attendance</TabsTrigger>
            <TabsTrigger value="hourly">Hourly Attendance</TabsTrigger>
            <TabsTrigger value="history">Attendance History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="punch" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="md:col-span-1">
                <AttendanceForm />
              </div>
              <div className="md:col-span-1 space-y-6">
                <div className="grid gap-6 md:grid-cols-1">
                  <div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
                    <h3 className="text-lg font-medium">Attendance Rules</h3>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <div className="w-2 h-2 mt-1.5 rounded-full bg-primary"></div>
                        <p className="text-sm text-muted-foreground">
                          You must be within the office geofencing radius of 100m to punch in/out.
                        </p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="w-2 h-2 mt-1.5 rounded-full bg-primary"></div>
                        <p className="text-sm text-muted-foreground">
                          Standard working hours: 9:00 AM - 6:00 PM, Monday to Friday.
                        </p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="w-2 h-2 mt-1.5 rounded-full bg-primary"></div>
                        <p className="text-sm text-muted-foreground">
                          Fingerprint authentication is required for attendance verification.
                        </p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="w-2 h-2 mt-1.5 rounded-full bg-primary"></div>
                        <p className="text-sm text-muted-foreground">
                          Late arrival (after 9:15 AM) will be marked in the system.
                        </p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="w-2 h-2 mt-1.5 rounded-full bg-primary"></div>
                        <p className="text-sm text-muted-foreground">
                          Early departure (before 5:45 PM) requires manager approval.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
                    <h3 className="text-lg font-medium">Need Help?</h3>
                    <p className="text-sm text-muted-foreground">
                      If you're experiencing issues with attendance punch-in/out, 
                      please contact HR at: <span className="text-primary">hr@geopunch.com</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="daily">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="md:col-span-1">
                <DailyAttendance />
              </div>
              <div className="md:col-span-1 space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
                  <h3 className="text-lg font-medium">Daily Attendance Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 mt-1.5 rounded-full bg-primary"></div>
                      <p className="text-sm text-muted-foreground">
                        Daily attendance is recorded once per day.
                      </p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 mt-1.5 rounded-full bg-primary"></div>
                      <p className="text-sm text-muted-foreground">
                        Attendance must be marked before 9:30 AM to be considered on time.
                      </p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 mt-1.5 rounded-full bg-primary"></div>
                      <p className="text-sm text-muted-foreground">
                        You must be physically present at the department to mark attendance.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="hourly">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="md:col-span-1">
                <HourlyAttendance />
              </div>
              <div className="md:col-span-1 space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
                  <h3 className="text-lg font-medium">Hourly Attendance Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 mt-1.5 rounded-full bg-primary"></div>
                      <p className="text-sm text-muted-foreground">
                        Check in when you arrive and check out when you leave.
                      </p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 mt-1.5 rounded-full bg-primary"></div>
                      <p className="text-sm text-muted-foreground">
                        Your working hours will be calculated based on check-in and check-out times.
                      </p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 mt-1.5 rounded-full bg-primary"></div>
                      <p className="text-sm text-muted-foreground">
                        Don't forget to check out before leaving the department.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="history">
            <AttendanceHistory />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AttendancePage;
