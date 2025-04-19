import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Fingerprint, MapPin, KeyRound } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth, AppUser } from "@/contexts/AuthContext";

const AttendanceForm = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [inProgress, setInProgress] = useState(false);
  const [isWithinRadius, setIsWithinRadius] = useState<boolean | null>(null);
  const [registeredKey, setRegisteredKey] = useState("");
  const [keyValid, setKeyValid] = useState<boolean | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Department location (updated with provided coordinates)
  const departmentLocation = { lat: 13.0351104, lng: 80.2127872 }; // Updated coordinates
  const geoFencingRadius = 100; // in meters
  
  // Pre-registered keys (in a real app, these would be securely stored and validated against a database)
  const validKeys = {
    student: "SIST-STU-2025",
    staff: "SIST-STAFF-2025",
    admin: "SIST-ADMIN-2025"
  };

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
          userId: user?.id || "1",
          name: user?.name || "User",
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
          description: "You are outside the department location for attendance",
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
          userId: user?.id || "1",
          name: user?.name || "User",
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
          description: "You are outside the department location for attendance",
        });
      }
      
      setLoading(false);
      setInProgress(false);
    }, 2000);
  };

  const handleKeySubmit = (type: 'in' | 'out') => {
    setLoading(true);
    
    // Get current location for pre-registered key validation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          
          // Update location state
          setLocation(currentLocation);
          
          // Check if within geofencing radius
          const distance = calculateDistance(
            currentLocation.lat,
            currentLocation.lng,
            departmentLocation.lat,
            departmentLocation.lng
          );
          
          const withinRadius = distance <= geoFencingRadius;
          setIsWithinRadius(withinRadius);
          
          // In a real application, this would validate against a secure database
          // Here we're just doing a simple validation based on user role
          const validKey = user?.role === 'admin' 
            ? validKeys.admin 
            : user?.role === 'staff' 
            ? validKeys.staff 
            : validKeys.student;
          
          const isValid = registeredKey === validKey;
          setKeyValid(isValid);
          
          if (isValid && withinRadius) {
            const now = new Date();
            const attendanceRecord = {
              userId: user?.id || "1",
              name: user?.name || "User",
              date: now.toLocaleDateString(),
              time: now.toLocaleTimeString(),
              type: type === 'in' ? "Check In" : "Check Out",
              location: currentLocation,
              timestamp: now.getTime(),
              method: "Pre-registered Key"
            };
            
            // Store in local storage
            const existingRecords = JSON.parse(localStorage.getItem('attendanceRecords') || '[]');
            existingRecords.push(attendanceRecord);
            localStorage.setItem('attendanceRecords', JSON.stringify(existingRecords));
            
            toast({
              title: type === 'in' ? "Check-in Successful" : "Check-out Successful",
              description: `You have ${type === 'in' ? 'checked in' : 'checked out'} at ${now.toLocaleTimeString()} using your pre-registered key`,
            });
            
            // Reset form
            setRegisteredKey("");
            setKeyValid(null);
          } else if (!withinRadius) {
            toast({
              variant: "destructive",
              title: "Location Error",
              description: "You must be at the department location to mark attendance",
            });
          } else {
            toast({
              variant: "destructive",
              title: "Invalid Key",
              description: "The key you entered is incorrect. Please try again.",
            });
          }
          
          setLoading(false);
        },
        (error) => {
          toast({
            variant: "destructive",
            title: "Location Error",
            description: `Unable to get your location: ${error.message}`,
          });
          setLoading(false);
        }
      );
    } else {
      toast({
        variant: "destructive",
        title: "Geolocation Not Supported",
        description: "Your browser does not support geolocation",
      });
      setLoading(false);
    }
  };

  const getCurrentUserKey = () => {
    if (user?.role === 'admin') return validKeys.admin;
    if (user?.role === 'staff') return validKeys.staff;
    return validKeys.student;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Record Attendance</CardTitle>
        <CardDescription>
          Use fingerprint authentication or pre-registered key to punch in/out
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="fingerprint" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="fingerprint">Fingerprint</TabsTrigger>
            <TabsTrigger value="key">Pre-registered Key</TabsTrigger>
          </TabsList>
          
          <TabsContent value="fingerprint" className="space-y-4">
            <div className="flex flex-col items-center justify-center space-y-6">
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
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="key" className="space-y-4">
            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="relative">
                <div className={`w-40 h-40 rounded-full flex items-center justify-center ${
                  keyValid === true
                    ? "bg-green-100"
                    : keyValid === false
                    ? "bg-red-100"
                    : "bg-blue-100"
                }`}>
                  <KeyRound
                    className={`h-20 w-20 ${
                      keyValid === true
                        ? "text-green-500"
                        : keyValid === false
                        ? "text-red-500"
                        : "text-blue-500"
                    }`}
                  />
                </div>
              </div>

              <div className="w-full space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="registeredKey">Enter Your Pre-registered Key</Label>
                  <div className="flex gap-2">
                    <Input
                      id="registeredKey"
                      value={registeredKey}
                      onChange={(e) => setRegisteredKey(e.target.value)}
                      placeholder="Enter your key"
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div className="text-center text-sm">
                  <p>
                    Your key: <span className="font-bold">{getCurrentUserKey()}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    (For demo purposes only - in a real app, this would be securely stored)
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <Button
                    disabled={loading || !registeredKey}
                    onClick={() => handleKeySubmit('in')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Check In
                  </Button>
                  <Button
                    disabled={loading || !registeredKey}
                    onClick={() => handleKeySubmit('out')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Check Out
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
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
