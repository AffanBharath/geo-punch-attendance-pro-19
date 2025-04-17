
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AttendanceForm from "@/components/AttendanceForm";
import AttendanceHistory from "@/components/AttendanceHistory";
import DailyAttendance from "@/components/DailyAttendance";
import HourlyAttendance from "@/components/HourlyAttendance";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const AttendancePage = () => {
  const { role } = useAuth();
  const { toast } = useToast();

  const handleRefreshLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          toast({
            title: "Location Refreshed",
            description: `Current coordinates: ${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`,
          });
        },
        (error) => {
          let errorMessage = "Unable to get your location.";
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Location access was denied. Please enable location services.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage = "The request to get your location timed out.";
              break;
          }
          
          toast({
            variant: "destructive",
            title: "Location Error",
            description: errorMessage,
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      toast({
        variant: "destructive",
        title: "Geolocation Not Supported",
        description: "Your browser does not support geolocation.",
      });
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
          <Button 
            onClick={handleRefreshLocation} 
            variant="outline" 
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Location
          </Button>
        </div>
        
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
                          College working hours: 9:00 AM - 3:15 PM, Monday to Friday.
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
                          Early departure (before 3:00 PM) requires manager approval.
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
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 mt-1.5 rounded-full bg-primary"></div>
                      <p className="text-sm text-muted-foreground">
                        College working hours: 9:00 AM to 3:15 PM.
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
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 mt-1.5 rounded-full bg-primary"></div>
                      <p className="text-sm text-muted-foreground">
                        College working hours: 9:00 AM to 3:15 PM.
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
