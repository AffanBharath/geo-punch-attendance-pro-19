import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Fingerprint, MapPin, Clock, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const HourlyAttendance = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [isWithinRadius, setIsWithinRadius] = useState<boolean | null>(null);
  const [checkedIn, setCheckedIn] = useState(false);
  const [lastCheckIn, setLastCheckIn] = useState<string | null>(null);
  const [showBiometricScan, setShowBiometricScan] = useState(false);
  const [biometricAction, setBiometricAction] = useState<"check-in" | "check-out">("check-in");
  const [locationError, setLocationError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Department location in Chennai
  const departmentLocation = { lat: 12.8396028, lng: 80.1552075 };
  const geoFencingRadius = 100; // in meters

  // College working hours: 9 AM to 3:15 PM
  const workingHoursStart = 9; // 9 AM
  const workingHoursEnd = 15.25; // 3:15 PM

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
          setLocationError(null);
          
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

  // Check if current time is within working hours
  const isWithinWorkingHours = () => {
    const now = new Date();
    const hours = now.getHours() + now.getMinutes() / 60;
    return hours >= workingHoursStart && hours <= workingHoursEnd;
  };

  const handleInitiateBiometricScan = (action: "check-in" | "check-out") => {
    if (!isWithinRadius) {
      toast({
        variant: "destructive",
        title: "Geofencing Error",
        description: "You are outside the department location for attendance",
      });
      return;
    }

    if (!isWithinWorkingHours() && action === "check-in") {
      toast({
        variant: "destructive",
        title: "Outside Working Hours",
        description: "Check-in can only be done between 9:00 AM and 3:15 PM",
      });
      return;
    }

    setBiometricAction(action);
    setShowBiometricScan(true);
  };

  const handleBiometricAuthentication = () => {
    setLoading(true);
    
    // Simulate fingerprint scanning
    setTimeout(() => {
      const now = new Date();
      const attendanceRecord = {
        userId: user?.id || "1",
        name: user?.name || "User",
        date: now.toLocaleDateString(),
        time: now.toLocaleTimeString(),
        type: biometricAction === "check-in" ? "Check In" : "Check Out",
        location: location,
        timestamp: now.getTime(),
        attendanceType: "hourly",
        verificationMethod: "biometric"
      };
      
      // Store in local storage
      const existingRecords = JSON.parse(localStorage.getItem('attendanceRecords') || '[]');
      existingRecords.push(attendanceRecord);
      localStorage.setItem('attendanceRecords', JSON.stringify(existingRecords));
      
      toast({
        title: "Biometric Authentication Successful",
        description: biometricAction === "check-in" 
          ? `You have checked in at ${now.toLocaleTimeString()}`
          : `You have checked out at ${now.toLocaleTimeString()}`,
      });
      
      if (biometricAction === "check-in") {
        setCheckedIn(true);
        setLastCheckIn(now.toLocaleTimeString());
      } else {
        setCheckedIn(false);
        setLastCheckIn(null);
      }
      
      setShowBiometricScan(false);
      setLoading(false);
    }, 2000);
  };

  const requestLocationPermission = () => {
    if (navigator.geolocation) {
      setLocationError(null);
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
          
          toast({
            title: "Location Access Granted",
            description: "Your location has been successfully detected.",
          });
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
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Hourly Attendance</CardTitle>
        <CardDescription>
          Check in and out to track your hours (9:00 AM - 3:15 PM)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="relative">
            <div 
              className={`w-40 h-40 rounded-full flex items-center justify-center ${
                loading 
                  ? "bg-primary/20" 
                  : showBiometricScan
                  ? "bg-blue-100 cursor-pointer"
                  : checkedIn
                  ? "bg-green-100"
                  : locationError
                  ? "bg-red-100"
                  : isWithinRadius 
                    ? "bg-blue-100" 
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
                      : showBiometricScan
                      ? "text-blue-500 animate-pulse"
                      : checkedIn
                      ? "text-green-500"
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
            
            {location && !locationError && (
              <div className="text-center text-sm text-muted-foreground">
                <p>
                  Current coordinates: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                </p>
              </div>
            )}
            
            {showBiometricScan ? (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded p-4 text-center">
                  <p className="text-blue-700 font-medium">
                    Please scan your fingerprint to {biometricAction === "check-in" ? "check in" : "check out"}
                  </p>
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
            ) : locationError ? (
              null // Don't show check-in/out buttons if there's a location error
            ) : checkedIn ? (
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
                  onClick={() => handleInitiateBiometricScan("check-out")}
                >
                  Scan Fingerprint to Check Out
                </Button>
              </div>
            ) : (
              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={loading || !location || !isWithinRadius || !isWithinWorkingHours()}
                onClick={() => handleInitiateBiometricScan("check-in")}
              >
                Scan Fingerprint to Check In
              </Button>
            )}
            
            {!locationError && !isWithinWorkingHours() && location && !checkedIn && (
              <div className="bg-yellow-50 border border-yellow-200 rounded p-4 text-center mt-4">
                <p className="text-yellow-700 text-sm">
                  Note: Check-in can only be done during college hours (9:00 AM - 3:15 PM)
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HourlyAttendance;
