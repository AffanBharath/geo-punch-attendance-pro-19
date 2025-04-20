
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Fingerprint, MapPin, AlertTriangle, RefreshCw, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth, AppUser } from "@/contexts/AuthContext";

const DailyAttendance = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [isWithinRadius, setIsWithinRadius] = useState<boolean | null>(null);
  const [hasMarkedAttendance, setHasMarkedAttendance] = useState(false);
  const [showBiometricScan, setShowBiometricScan] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [departmentLocation, setDepartmentLocation] = useState({ lat: 12.8396331, lng: 80.1552515 });
  const [geoFencingRadius, setGeoFencingRadius] = useState(100); // in meters
  const [refreshingLocation, setRefreshingLocation] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { toast } = useToast();
  const { user } = useAuth();

  // Daily attendance window: 9:00 AM to 9:15 AM
  const attendanceStartTime = 9 * 60; // 9:00 AM in minutes
  const attendanceEndTime = 9 * 60 + 15; // 9:15 AM in minutes

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // Listen for location updates from admin
  useEffect(() => {
    const checkLocationUpdates = () => {
      const locationLastUpdated = localStorage.getItem("locationLastUpdated");
      if (locationLastUpdated) {
        loadDepartmentLocation();
        checkLocation();
      }
    };

    window.addEventListener("storage", checkLocationUpdates);

    return () => {
      window.removeEventListener("storage", checkLocationUpdates);
    };
  }, []);

  useEffect(() => {
    // Load department location data
    loadDepartmentLocation();
    
    // Check if user has already marked attendance today
    const checkExistingAttendance = () => {
      const existingRecords = JSON.parse(localStorage.getItem('attendanceRecords') || '[]');
      const today = new Date().toLocaleDateString();
      
      const markedToday = existingRecords.some(
        (record: any) => 
          record.userId === (user?.id || "1") && 
          record.date === today &&
          record.attendanceType === "daily"
      );
      
      setHasMarkedAttendance(markedToday);
    };
    
    checkExistingAttendance();
    
    // Get current location
    checkLocation();
  }, [user]);

  const loadDepartmentLocation = useCallback(() => {
    // Get the user's department (in a real app this would come from user profile)
    const userDept = user?.department || "default-dept";
    
    // Load department locations
    const storedLocations = JSON.parse(localStorage.getItem("departmentLocations") || "[]");
    const userDeptLocation = storedLocations.find((dept: any) => dept.id === userDept) || null;
    
    if (userDeptLocation) {
      setDepartmentLocation({ lat: userDeptLocation.latitude, lng: userDeptLocation.longitude });
      setGeoFencingRadius(userDeptLocation.radius);
      console.log("Department location loaded:", { lat: userDeptLocation.latitude, lng: userDeptLocation.longitude }, "radius:", userDeptLocation.radius);
    } else {
      console.log("Department not found, using default location");
    }
  }, [user]);

  const checkLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setLocation(currentLocation);
          setLocationError(null);
          
          // Check if within geofencing radius
          const distance = calculateDistance(
            currentLocation.lat,
            currentLocation.lng,
            departmentLocation.lat,
            departmentLocation.lng
          );
          
          const withinRadius = distance <= geoFencingRadius;
          setIsWithinRadius(withinRadius);
          
          console.log("Current location:", currentLocation);
          console.log("Department location:", departmentLocation);
          console.log("Distance:", distance, "meters");
          console.log("Geofencing radius:", geoFencingRadius, "meters");
          console.log("Within radius:", withinRadius);
        },
        (error) => {
          let errorMessage = "Unable to get your location";
          
          // Provide more specific error messages
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Location access denied. Please enable location permissions in your browser settings to mark attendance.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information is unavailable. Please try again later.";
              break;
            case error.TIMEOUT:
              errorMessage = "Location request timed out. Please try again.";
              break;
            default:
              errorMessage = `Unable to get your location: ${error.message}`;
          }
          
          setLocationError(errorMessage);
          setIsWithinRadius(false);
          
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
      const errorMessage = "Your browser does not support geolocation. Please use a modern browser to mark attendance.";
      setLocationError(errorMessage);
      
      toast({
        variant: "destructive",
        title: "Geolocation Not Supported",
        description: errorMessage,
      });
    }
  }, [departmentLocation, geoFencingRadius, toast]);

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

  // Check if current time is within the attendance window (9:00-9:15 AM)
  const isWithinAttendanceWindow = () => {
    const now = currentTime;
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    return currentMinutes >= attendanceStartTime && currentMinutes <= attendanceEndTime;
  };

  const handleInitiateBiometricScan = () => {
    if (!isWithinRadius) {
      toast({
        variant: "destructive",
        title: "Geofencing Error",
        description: "You are outside the department location for attendance",
      });
      return;
    }

    if (!isWithinAttendanceWindow()) {
      toast({
        variant: "destructive",
        title: "Outside Attendance Window",
        description: "Attendance can only be marked between 9:00 AM and 9:15 AM",
      });
      return;
    }

    setShowBiometricScan(true);
  };

  const handleBiometricAuthentication = () => {
    setLoading(true);
    
    // Simulate fingerprint scanning
    setTimeout(() => {
      // Simulate successful biometric authentication
      const now = new Date();
      const attendanceRecord = {
        userId: user?.id || "1",
        name: user?.name || "User",
        date: now.toLocaleDateString(),
        time: now.toLocaleTimeString(),
        type: "Present",
        location: location,
        timestamp: now.getTime(),
        attendanceType: "daily",
        verificationMethod: "biometric"
      };
      
      // Store in local storage
      const existingRecords = JSON.parse(localStorage.getItem('attendanceRecords') || '[]');
      existingRecords.push(attendanceRecord);
      localStorage.setItem('attendanceRecords', JSON.stringify(existingRecords));
      
      toast({
        title: "Biometric Authentication Successful",
        description: `Your attendance has been marked for today (${now.toLocaleDateString()})`,
      });
      
      setHasMarkedAttendance(true);
      setShowBiometricScan(false);
      setLoading(false);
    }, 2000);
  };

  const requestLocationPermission = () => {
    if (navigator.geolocation) {
      setLocationError(null);
      checkLocation();
    }
  };
  
  const handleRefreshLocation = () => {
    setRefreshingLocation(true);
    loadDepartmentLocation();
    setTimeout(() => {
      checkLocation();
      setRefreshingLocation(false);
      toast({
        title: "Location Refreshed",
        description: "Your location has been refreshed"
      });
    }, 1000);
  };

  // Format time for display
  const formatTimeWindow = () => {
    return "9:00 AM - 9:15 AM";
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Daily Attendance</CardTitle>
          <CardDescription>
            Mark your attendance for the day ({formatTimeWindow()})
          </CardDescription>
        </div>
        <Button 
          variant="outline"
          size="icon"
          onClick={handleRefreshLocation}
          disabled={refreshingLocation}
        >
          <RefreshCw className={`h-4 w-4 ${refreshingLocation ? "animate-spin" : ""}`} />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="relative">
            <div 
              className={`w-40 h-40 rounded-full flex items-center justify-center ${
                loading 
                  ? "bg-primary/20" 
                  : hasMarkedAttendance
                  ? "bg-green-100"
                  : showBiometricScan
                  ? "bg-blue-100 cursor-pointer"
                  : isWithinRadius 
                    ? "bg-blue-100" 
                    : locationError
                    ? "bg-red-100"
                    : isWithinRadius === false 
                      ? "bg-red-100" 
                      : "bg-gray-100"
              }`}
              onClick={showBiometricScan ? handleBiometricAuthentication : undefined}
            >
              {locationError ? (
                <AlertTriangle className="h-20 w-20 text-red-500" />
              ) : (
                <Fingerprint
                  className={`h-20 w-20 ${
                    loading 
                      ? "text-primary animate-pulse" 
                      : hasMarkedAttendance
                      ? "text-green-500"
                      : showBiometricScan
                      ? "text-blue-500 animate-pulse"
                      : isWithinRadius 
                        ? "text-blue-500" 
                        : isWithinRadius === false 
                          ? "text-red-500" 
                          : "text-gray-400"
                  }`}
                />
              )}
              {loading && (
                <>
                  <span className="absolute inset-0 rounded-full animate-ripple bg-primary/20"></span>
                  <span className="absolute inset-0 rounded-full animate-ripple bg-primary/20 animation-delay-200"></span>
                </>
              )}
            </div>
          </div>

          <div className="w-full space-y-4">
            {locationError ? (
              <div className="bg-red-50 border border-red-200 rounded p-4 text-center">
                <p className="text-red-700 font-medium">Location Error</p>
                <p className="text-sm text-red-600 mt-1">{locationError}</p>
                <Button 
                  className="mt-3 bg-red-600 hover:bg-red-700"
                  onClick={requestLocationPermission}
                >
                  Grant Location Access
                </Button>
              </div>
            ) : (
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
            )}
            
            {/* Time status */}
            <div className="flex items-center justify-center space-x-2 text-sm">
              <Clock className={`h-4 w-4 ${
                isWithinAttendanceWindow() 
                  ? "text-green-500" 
                  : "text-amber-500"
              }`} />
              <span>
                {isWithinAttendanceWindow()
                  ? "Attendance window is open"
                  : `Attendance window: ${formatTimeWindow()}`}
              </span>
            </div>
            
            {location && !locationError && (
              <div className="text-center text-sm text-muted-foreground">
                <p>
                  Current coordinates: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                </p>
                <p className="mt-1">
                  Department coordinates: {departmentLocation.lat.toFixed(6)}, {departmentLocation.lng.toFixed(6)}
                </p>
                <p className="mt-1">
                  Geofence radius: {geoFencingRadius} meters
                </p>
              </div>
            )}
            
            {hasMarkedAttendance ? (
              <div className="bg-green-50 border border-green-200 rounded p-4 text-center">
                <p className="text-green-700 font-medium">Your attendance has been marked for today</p>
              </div>
            ) : showBiometricScan ? (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded p-4 text-center">
                  <p className="text-blue-700 font-medium">Please scan your fingerprint to mark attendance</p>
                  <p className="text-xs text-blue-600 mt-1">Tap on the fingerprint icon above</p>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowBiometricScan(false)}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                className="w-full"
                disabled={loading || !location || !isWithinRadius || !isWithinAttendanceWindow() || !!locationError}
                onClick={handleInitiateBiometricScan}
              >
                Scan Fingerprint
              </Button>
            )}
            
            {!locationError && !isWithinAttendanceWindow() && location && (
              <div className="bg-yellow-50 border border-yellow-200 rounded p-4 text-center mt-4">
                <p className="text-yellow-700 text-sm">
                  Note: Attendance can only be marked during the window {formatTimeWindow()}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyAttendance;
