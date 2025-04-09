
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Fingerprint, MapPin, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const HourlyAttendance = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [isWithinRadius, setIsWithinRadius] = useState<boolean | null>(null);
  const [checkedIn, setCheckedIn] = useState(false);
  const [lastCheckIn, setLastCheckIn] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Department location
  const departmentLocation = { lat: 13.0351104, lng: 80.2127872 };
  const geoFencingRadius = 100; // in meters

  useEffect(() => {
    // Check if user is already checked in
    const checkExistingCheckIn = () => {
      const existingRecords = JSON.parse(localStorage.getItem('attendanceRecords') || '[]');
      const today = new Date().toLocaleDateString();
      
      // Sort records by timestamp in descending order
      const sortedRecords = existingRecords
        .filter((record: any) => 
          record.userId === (user?.id || "1") && 
          record.date === today &&
          record.attendanceType === "hourly"
        )
        .sort((a: any, b: any) => b.timestamp - a.timestamp);
      
      if (sortedRecords.length > 0) {
        const latestRecord = sortedRecords[0];
        // If the last record is a check-in, the user is currently checked in
        if (latestRecord.type === "Check In") {
          setCheckedIn(true);
          setLastCheckIn(latestRecord.time);
        } else {
          setCheckedIn(false);
          setLastCheckIn(null);
        }
      }
    };
    
    checkExistingCheckIn();
    
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
            departmentLocation.lat,
            departmentLocation.lng
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
  }, [user]);

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

  const handleCheckIn = () => {
    setLoading(true);
    
    // Simulate fingerprint scanning
    setTimeout(() => {
      if (isWithinRadius) {
        const now = new Date();
        const attendanceRecord = {
          userId: user?.id || "1",
          name: user?.name || "User",
          date: now.toLocaleDateString(),
          time: now.toLocaleTimeString(),
          type: "Check In",
          location: location,
          timestamp: now.getTime(),
          attendanceType: "hourly"
        };
        
        // Store in local storage
        const existingRecords = JSON.parse(localStorage.getItem('attendanceRecords') || '[]');
        existingRecords.push(attendanceRecord);
        localStorage.setItem('attendanceRecords', JSON.stringify(existingRecords));
        
        toast({
          title: "Check-in Successful",
          description: `You have checked in at ${now.toLocaleTimeString()}`,
        });
        
        setCheckedIn(true);
        setLastCheckIn(now.toLocaleTimeString());
      } else {
        toast({
          variant: "destructive",
          title: "Geofencing Error",
          description: "You are outside the department location for attendance",
        });
      }
      
      setLoading(false);
    }, 2000);
  };

  const handleCheckOut = () => {
    setLoading(true);
    
    // Simulate fingerprint scanning
    setTimeout(() => {
      if (isWithinRadius) {
        const now = new Date();
        const attendanceRecord = {
          userId: user?.id || "1",
          name: user?.name || "User",
          date: now.toLocaleDateString(),
          time: now.toLocaleTimeString(),
          type: "Check Out",
          location: location,
          timestamp: now.getTime(),
          attendanceType: "hourly"
        };
        
        // Store in local storage
        const existingRecords = JSON.parse(localStorage.getItem('attendanceRecords') || '[]');
        existingRecords.push(attendanceRecord);
        localStorage.setItem('attendanceRecords', JSON.stringify(existingRecords));
        
        toast({
          title: "Check-out Successful",
          description: `You have checked out at ${now.toLocaleTimeString()}`,
        });
        
        setCheckedIn(false);
        setLastCheckIn(null);
      } else {
        toast({
          variant: "destructive",
          title: "Geofencing Error",
          description: "You are outside the department location for attendance",
        });
      }
      
      setLoading(false);
    }, 2000);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Hourly Attendance</CardTitle>
        <CardDescription>
          Check in and out to track your hours
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="relative">
            <div className={`w-40 h-40 rounded-full flex items-center justify-center ${
              loading 
                ? "bg-primary/20" 
                : checkedIn
                ? "bg-green-100"
                : isWithinRadius 
                  ? "bg-blue-100" 
                  : isWithinRadius === false 
                    ? "bg-red-100" 
                    : "bg-gray-100"
            }`}>
              <Fingerprint
                className={`h-20 w-20 ${
                  loading 
                    ? "text-primary animate-pulse" 
                    : checkedIn
                    ? "text-green-500"
                    : isWithinRadius 
                      ? "text-blue-500" 
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

          <div className="w-full space-y-4">
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
                  ? "You're within the department geofence"
                  : "Warning: You're outside the department geofence"}
              </span>
            </div>
            
            <div className="text-center text-sm text-muted-foreground">
              {location && (
                <p>
                  Current coordinates: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                </p>
              )}
            </div>
            
            {checkedIn ? (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded p-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-green-700">
                    <Clock className="h-5 w-5" />
                    <span className="font-medium">You are currently checked in</span>
                  </div>
                  {lastCheckIn && (
                    <p className="text-sm text-green-600 mt-1">
                      Last check-in: {lastCheckIn}
                    </p>
                  )}
                </div>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={loading || !location || !isWithinRadius}
                  onClick={handleCheckOut}
                >
                  Check Out
                </Button>
              </div>
            ) : (
              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={loading || !location || !isWithinRadius}
                onClick={handleCheckIn}
              >
                Check In
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HourlyAttendance;
