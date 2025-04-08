
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AttendanceForm from "@/components/AttendanceForm";
import AttendanceHistory from "@/components/AttendanceHistory";

const AttendancePage = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
        
        <Tabs defaultValue="punch" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="punch">Punch In/Out</TabsTrigger>
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
          
          <TabsContent value="history">
            <AttendanceHistory />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AttendancePage;
