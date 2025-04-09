
import RoleLayout from "@/components/RoleLayout";
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Users, Fingerprint, Clock, Shield, Calendar, GraduationCap, FileSpreadsheet,
  Settings, Building, AlertTriangle, Power
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [maintenanceModeOpen, setMaintenanceModeOpen] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState("The system is currently under maintenance. Please try again later.");
  
  const handleMaintenanceModeToggle = () => {
    const newMode = !maintenanceMode;
    setMaintenanceMode(newMode);
    
    if (newMode) {
      toast({
        title: "Maintenance Mode Enabled",
        description: "The system is now in maintenance mode. Users will see maintenance message.",
      });
    } else {
      toast({
        title: "Maintenance Mode Disabled",
        description: "The system is now operating normally.",
      });
    }
    
    setMaintenanceModeOpen(false);
  };

  return (
    <RoleLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight text-admin-primary">Admin Dashboard</h1>
          <Button
            variant="outline"
            onClick={() => setMaintenanceModeOpen(true)}
            className={`${
              maintenanceMode ? 'bg-yellow-100 text-yellow-800 border-yellow-300' : ''
            }`}
          >
            <Power className="mr-2 h-4 w-4" />
            {maintenanceMode ? 'System in Maintenance' : 'Maintenance Mode'}
          </Button>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-admin-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Users className="mr-2 h-4 w-4 text-admin-primary" />
                Staff
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-2xl font-bold">24</p>
                <p className="text-sm text-muted-foreground">Total Staff Members</p>
                <div className="pt-2">
                  <Link to="/admin/manage-staff">
                    <Button size="sm" variant="outline" className="text-admin-primary border-admin-primary/20 hover:bg-admin-accent/20">
                      Manage Staff
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-admin-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <GraduationCap className="mr-2 h-4 w-4 text-admin-primary" />
                Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-2xl font-bold">152</p>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <div className="pt-2">
                  <Link to="/admin/manage-students">
                    <Button size="sm" variant="outline" className="text-admin-primary border-admin-primary/20 hover:bg-admin-accent/20">
                      Manage Students
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-admin-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Building className="mr-2 h-4 w-4 text-admin-primary" />
                Departments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-2xl font-bold">5</p>
                <p className="text-sm text-muted-foreground">Total Departments</p>
                <div className="pt-2">
                  <Link to="/admin/manage-departments">
                    <Button size="sm" variant="outline" className="text-admin-primary border-admin-primary/20 hover:bg-admin-accent/20">
                      Manage Departments
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-admin-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <FileSpreadsheet className="mr-2 h-4 w-4 text-admin-primary" />
                Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-2xl font-bold">15</p>
                <p className="text-sm text-muted-foreground">Generated Reports</p>
                <div className="pt-2">
                  <Link to="/admin/reports">
                    <Button size="sm" variant="outline" className="text-admin-primary border-admin-primary/20 hover:bg-admin-accent/20">
                      View Reports
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-admin-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Fingerprint className="mr-2 h-5 w-5 text-admin-primary" />
                <span>Attendance Overview</span>
              </CardTitle>
              <CardDescription>Today's attendance statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-medium mb-2">Staff Attendance</p>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Present: 22/24</span>
                    <span className="font-medium">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-2">Student Attendance</p>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Present: 134/152</span>
                    <span className="font-medium">88%</span>
                  </div>
                  <Progress value={88} className="h-2" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-red-50 rounded-lg">
                    <p className="text-sm font-medium text-red-600">Attendance Issues</p>
                    <p className="text-xs text-muted-foreground mt-1">5 students below 75%</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm font-medium text-yellow-600">Leave Requests</p>
                    <p className="text-xs text-muted-foreground mt-1">3 pending approvals</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-admin-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5 text-admin-primary" />
                <span>System Alerts</span>
              </CardTitle>
              <CardDescription>Important notifications requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { 
                    title: "Fingerprint Scanner Maintenance", 
                    description: "Room CS-101 scanner needs calibration", 
                    time: "2 hours ago",
                    type: "warning"
                  },
                  { 
                    title: "Student Registration Issue", 
                    description: "3 students with pending ID verification", 
                    time: "5 hours ago",
                    type: "info"
                  },
                  { 
                    title: "Database Backup", 
                    description: "Scheduled backup completed successfully", 
                    time: "Yesterday",
                    type: "success"
                  },
                  { 
                    title: "System Update Required", 
                    description: "Security update available for attendance system", 
                    time: "2 days ago",
                    type: "error"
                  },
                ].map((alert, index) => (
                  <div key={index} className="flex items-start space-x-3 pb-3 border-b last:border-0 last:pb-0">
                    <div className={`min-w-8 w-8 h-8 rounded-full flex items-center justify-center 
                      ${alert.type === 'warning' ? 'bg-yellow-100 text-yellow-600' : 
                        alert.type === 'info' ? 'bg-blue-100 text-blue-600' :
                        alert.type === 'success' ? 'bg-green-100 text-green-600' :
                        'bg-red-100 text-red-600'}`}>
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex justify-between">
                        <p className="text-sm font-medium">{alert.title}</p>
                        <span className="text-xs text-muted-foreground">{alert.time}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{alert.description}</p>
                    </div>
                  </div>
                ))}
                
                <Button variant="outline" className="w-full border-admin-primary/20 text-admin-primary hover:bg-admin-accent/20">
                  View All Alerts
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-admin-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5 text-admin-primary" />
              <span>System Management</span>
            </CardTitle>
            <CardDescription>Quick access to important system settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link to="/admin/manage-staff">
                <Button variant="outline" className="w-full h-auto py-4 px-2 flex flex-col items-center gap-2 border-admin-primary/20 hover:bg-admin-accent/20">
                  <Users className="h-6 w-6 text-admin-primary" />
                  <span className="text-sm">User Management</span>
                </Button>
              </Link>
              
              <Button variant="outline" className="h-auto py-4 px-2 flex flex-col items-center gap-2 border-admin-primary/20 hover:bg-admin-accent/20">
                <Fingerprint className="h-6 w-6 text-admin-primary" />
                <span className="text-sm">Attendance Rules</span>
              </Button>
              
              <Link to="/admin/reports">
                <Button variant="outline" className="w-full h-auto py-4 px-2 flex flex-col items-center gap-2 border-admin-primary/20 hover:bg-admin-accent/20">
                  <FileSpreadsheet className="h-6 w-6 text-admin-primary" />
                  <span className="text-sm">Report Settings</span>
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                className="h-auto py-4 px-2 flex flex-col items-center gap-2 border-admin-primary/20 hover:bg-admin-accent/20"
                onClick={() => setMaintenanceModeOpen(true)}
              >
                <Settings className="h-6 w-6 text-admin-primary" />
                <span className="text-sm">System Settings</span>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Maintenance Mode Dialog */}
        <Dialog open={maintenanceModeOpen} onOpenChange={setMaintenanceModeOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>System Maintenance Mode</DialogTitle>
              <DialogDescription>
                Enable maintenance mode to temporarily restrict system access
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="maintenance-mode"
                  checked={maintenanceMode}
                  onCheckedChange={setMaintenanceMode}
                />
                <Label htmlFor="maintenance-mode">
                  {maintenanceMode ? "Disable Maintenance Mode" : "Enable Maintenance Mode"}
                </Label>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="maintenance-message">Maintenance Message</Label>
                <Textarea
                  id="maintenance-message"
                  value={maintenanceMessage}
                  onChange={(e) => setMaintenanceMessage(e.target.value)}
                  placeholder="Message to display to users during maintenance"
                  className="min-h-[100px]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setMaintenanceModeOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleMaintenanceModeToggle}
                className={maintenanceMode ? "bg-green-600 hover:bg-green-700" : "bg-yellow-600 hover:bg-yellow-700"}
              >
                {maintenanceMode ? "Disable Maintenance Mode" : "Enable Maintenance Mode"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </RoleLayout>
  );
};

export default AdminDashboardPage;
