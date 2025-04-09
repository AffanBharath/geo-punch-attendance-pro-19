
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AlertCircle, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MaintenanceContext } from "@/App";
import { useContext } from "react";

const MaintenanceMode = () => {
  const { isMaintenanceMode, setMaintenanceMode } = useContext(MaintenanceContext);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const toggleMaintenanceMode = async () => {
    setLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setMaintenanceMode(!isMaintenanceMode);
      
      toast({
        title: !isMaintenanceMode ? "Maintenance Mode Activated" : "Maintenance Mode Deactivated",
        description: !isMaintenanceMode
          ? "Staff and student portals are now disabled."
          : "Staff and student portals are now accessible.",
        variant: !isMaintenanceMode ? "destructive" : "default",
      });
      
      setLoading(false);
    }, 1000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Maintenance</CardTitle>
        <CardDescription>
          Enable maintenance mode to temporarily disable access to staff and student portals
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="maintenance-toggle" className="text-base">Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">
                  When enabled, all staff and student accounts will be redirected to a maintenance page
                </p>
              </div>
              <Switch
                id="maintenance-toggle"
                checked={isMaintenanceMode}
                onCheckedChange={toggleMaintenanceMode}
                disabled={loading}
              />
            </div>
            
            {isMaintenanceMode && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-800">Maintenance Mode Active</h4>
                  <p className="text-sm text-red-700 mt-1">
                    Staff and student portals are currently disabled. Only administrators can access the system.
                  </p>
                </div>
              </div>
            )}
            
            {!isMaintenanceMode && (
              <div className="bg-green-50 border border-green-200 rounded-md p-4 flex items-start space-x-3">
                <Check className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-800">System Operational</h4>
                  <p className="text-sm text-green-700 mt-1">
                    All portals are currently accessible to staff and students.
                  </p>
                </div>
              </div>
            )}
          </div>
          
          <div className="grid gap-4">
            <Button 
              variant={isMaintenanceMode ? "default" : "destructive"}
              className="w-full"
              onClick={toggleMaintenanceMode}
              disabled={loading}
            >
              {loading ? "Updating..." : isMaintenanceMode ? "Disable Maintenance Mode" : "Enable Maintenance Mode"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MaintenanceMode;
