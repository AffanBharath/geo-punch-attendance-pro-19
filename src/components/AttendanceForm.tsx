
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Fingerprint, MapPin } from "lucide-react";
import { useToast } from "@/components/ui/toast";

const AttendanceForm = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [inProgress, setInProgress] = useState(false);
  const [isWithinRadius, setIsWithinRadius] = useState<boolean | null>(null);
  const { toast } = useToast();

  // Office location (example)
  const officeLocation = { lat: 37.7749, lng: -122.4194 };
  const geoFencingRadius = 100; // in meters

  useEffect(() => {
    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setLocation(currentLocation);
          
          // Check if within geofencing radius
          const distance = calculateDistance(
            currentLocation.lat,
            currentLocation.lng,
            officeLocation.lat,
            officeLocation.lng
          );
          
          setIsWithinRadius(distance <= geoFencingRadius);
        },
        (error) => {
          toast({
            variant: "destructive",
            title: "Location Error",
            description: `Unable to get your location: ${error.message}`,
          });
        }
      );
    } else {
      toast({
        variant: "destructive",
        title: "Geolocation Not Supported",
        description: "Your browser does not support geolocation",
      });
    }
  }, []);

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
  };

  const handlePunchIn = () => {
    setLoading(true);
    setInProgress(true);
    
    // Simulate fingerprint scanning
    setTimeout(() => {
      if (isWithinRadius) {
        const now = new Date();
        const attendanceRecord = {
          userId: "1",
          name: "John Doe",
          date: now.toLocaleDateString(),
          time: now.toLocaleTimeString(),
          type: "Check In",
          location: location,
          timestamp: now.getTime(),
        };
        
        // Store in local storage (in a real app, this would be sent to a server)
        const existingRecords = JSON.parse(localStorage.getItem('attendanceRecords') || '[]');
        existingRecords.push(attendanceRecord);
        localStorage.setItem('attendanceRecords', JSON.stringify(existingRecords));
        
        toast({
          title: "Check-in Successful",
          description: `You have checked in at ${now.toLocaleTimeString()}`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Geofencing Error",
          description: "You are outside the allowed radius for attendance",
        });
      }
      
      setLoading(false);
      setInProgress(false);
    }, 2000);
  };

  const handlePunchOut = () => {
    setLoading(true);
    setInProgress(true);
    
    // Simulate fingerprint scanning
    setTimeout(() => {
      if (isWithinRadius) {
        const now = new Date();
        const attendanceRecord = {
          userId: "1",
          name: "John Doe",
          date: now.toLocaleDateString(),
          time: now.toLocaleTimeString(),
          type: "Check Out",
          location: location,
          timestamp: now.getTime(),
        };
        
        // Store in local storage
        const existingRecords = JSON.parse(localStorage.getItem('attendanceRecords') || '[]');
        existingRecords.push(attendanceRecord);
        localStorage.setItem('attendanceRecords', JSON.stringify(existingRecords));
        
        toast({
          title: "Check-out Successful",
          description: `You have checked out at ${now.toLocaleTimeString()}`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Geofencing Error",
          description: "You are outside the allowed radius for attendance",
        });
      }
      
      setLoading(false);
      setInProgress(false);
    }, 2000);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Record Attendance</CardTitle>
        <CardDescription>
          Use fingerprint authentication to punch in/out
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-6">
        <div className="relative">
          <div className={`w-40 h-40 rounded-full flex items-center justify-center ${
            loading 
              ? "bg-primary/20" 
              : isWithinRadius 
                ? "bg-green-100" 
                : isWithinRadius === false 
                  ? "bg-red-100" 
                  : "bg-gray-100"
          }`}>
            <Fingerprint
              className={`h-20 w-20 ${
                loading 
                  ? "text-primary animate-pulse" 
                  : isWithinRadius 
                    ? "text-green-500" 
                    : isWithinRadius === false 
                      ? "text-red-500" 
                      : "text-gray-400"
              }`}
            />
            {loading && (
              <>
                <span className="absolute inset-0 rounded-full animate-ripple bg-primary/20"></span>
                <span className="absolute inset-0 rounded-full animate-ripple bg-primary/20 animation-delay-200"></span>
              </>
            )}
          </div>
        </div>

        <div className="w-full space-y-2">
          <div className="flex items-center justify-center space-x-2 text-sm">
            <MapPin className={`h-4 w-4 ${
              isWithinRadius 
                ? "text-green-500" 
                : isWithinRadius === false 
                  ? "text-red-500" 
                  : "text-gray-400"
            }`} />
            <span>
              {isWithinRadius === null
                ? "Getting your location..."
                : isWithinRadius
                ? "You're within the office geofence"
                : "Warning: You're outside the office geofence"}
            </span>
          </div>
          
          <div className="text-center text-sm text-muted-foreground">
            {location && (
              <p>
                Current coordinates: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
              </p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          className="w-[48%] space-x-2"
          disabled={loading || !location || !isWithinRadius}
          onClick={handlePunchIn}
        >
          <span>Check In</span>
        </Button>
        <Button
          variant="outline"
          className="w-[48%] space-x-2"
          disabled={loading || !location || !isWithinRadius}
          onClick={handlePunchOut}
        >
          <span>Check Out</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AttendanceForm;
