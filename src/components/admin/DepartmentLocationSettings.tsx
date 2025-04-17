
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Save, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DepartmentLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
}

const DepartmentLocationSettings = () => {
  const [departmentLocations, setDepartmentLocations] = useState<DepartmentLocation[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [latitude, setLatitude] = useState<string>("12.8396331");
  const [longitude, setLongitude] = useState<string>("80.1552515");
  const [radius, setRadius] = useState<string>("100");
  const { toast } = useToast();

  useEffect(() => {
    loadDepartmentLocations();
  }, []);

  const loadDepartmentLocations = () => {
    // Load department locations from localStorage
    const storedLocations = localStorage.getItem("departmentLocations");
    if (storedLocations) {
      setDepartmentLocations(JSON.parse(storedLocations));
    } else {
      // Initialize with default department locations if no data exists
      const departments = JSON.parse(localStorage.getItem("departments") || "[]");
      
      // If no departments exist, create a default one
      if (departments.length === 0) {
        const defaultDepartment = {
          id: "default-dept",
          name: "Default Department"
        };
        
        const defaultLocations = [{
          id: defaultDepartment.id,
          name: defaultDepartment.name,
          latitude: 12.8396331,
          longitude: 80.1552515,
          radius: 100
        }];
        
        setDepartmentLocations(defaultLocations);
        localStorage.setItem("departmentLocations", JSON.stringify(defaultLocations));
        localStorage.setItem("departments", JSON.stringify([defaultDepartment]));
      } else {
        const defaultLocations = departments.map((dept: any) => ({
          id: dept.id,
          name: dept.name,
          latitude: 12.8396331,
          longitude: 80.1552515,
          radius: 100
        }));
        
        setDepartmentLocations(defaultLocations);
        localStorage.setItem("departmentLocations", JSON.stringify(defaultLocations));
      }
    }
  };

  useEffect(() => {
    // Load department data when component mounts
    if (departmentLocations.length > 0 && !selectedDepartment) {
      setSelectedDepartment(departmentLocations[0].id);
      setLatitude(departmentLocations[0].latitude.toString());
      setLongitude(departmentLocations[0].longitude.toString());
      setRadius(departmentLocations[0].radius.toString());
    }
  }, [departmentLocations, selectedDepartment]);

  const handleDepartmentChange = (deptId: string) => {
    const selectedDept = departmentLocations.find(dept => dept.id === deptId);
    if (selectedDept) {
      setSelectedDepartment(deptId);
      setLatitude(selectedDept.latitude.toString());
      setLongitude(selectedDept.longitude.toString());
      setRadius(selectedDept.radius.toString());
    }
  };

  const handleSaveLocation = () => {
    // Validate inputs
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const rad = parseInt(radius);
    
    if (isNaN(lat) || isNaN(lng) || isNaN(rad)) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please enter valid coordinates and radius."
      });
      return;
    }
    
    // Update department location
    const updatedLocations = departmentLocations.map(dept => 
      dept.id === selectedDepartment 
        ? { ...dept, latitude: lat, longitude: lng, radius: rad }
        : dept
    );
    
    setDepartmentLocations(updatedLocations);
    localStorage.setItem("departmentLocations", JSON.stringify(updatedLocations));
    
    toast({
      title: "Location Updated",
      description: "Department geolocation coordinates have been updated successfully."
    });
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toString());
          setLongitude(position.coords.longitude.toString());
          
          toast({
            title: "Current Location Detected",
            description: "Your current location has been set as the department location."
          });
        },
        (error) => {
          toast({
            variant: "destructive",
            title: "Location Error",
            description: "Unable to get your current location. Please enter coordinates manually."
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
        description: "Your browser does not support geolocation. Please enter coordinates manually."
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapPin className="mr-2 h-5 w-5" />
          Department Geolocation Settings
        </CardTitle>
        <CardDescription>
          Set location coordinates and geofencing radius for each department
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {departmentLocations.length === 0 ? (
          <div className="p-4 bg-yellow-50 rounded-md flex items-start gap-2 text-yellow-800">
            <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">No departments found</p>
              <p className="text-sm">Please add departments in the Department Management section first.</p>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="department-select">Select Department</Label>
              <select 
                id="department-select"
                className="w-full p-2 border rounded-md"
                value={selectedDepartment}
                onChange={(e) => handleDepartmentChange(e.target.value)}
              >
                {departmentLocations.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="text"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="e.g., 12.8396331"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  type="text"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="e.g., 80.1552515"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="radius">Geofencing Radius (meters)</Label>
              <Input
                id="radius"
                type="number"
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
                placeholder="e.g., 100"
              />
              <p className="text-xs text-muted-foreground mt-1">
                The radius (in meters) within which attendance can be marked
              </p>
            </div>
            
            <div className="flex gap-2 mt-4">
              <Button onClick={getCurrentLocation} variant="outline" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Use Current Location
              </Button>
              <Button onClick={handleSaveLocation} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Location
              </Button>
            </div>
          </>
        )}
        
        <div className="p-4 bg-muted rounded-md mt-4">
          <p className="text-sm font-medium">Location Information</p>
          <p className="text-xs text-muted-foreground mt-1">
            These coordinates are used for validating student and staff attendance 
            through geofencing. When users try to mark attendance, their current 
            location is compared with these department coordinates.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DepartmentLocationSettings;
