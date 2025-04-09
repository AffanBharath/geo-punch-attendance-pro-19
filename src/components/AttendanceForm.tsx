
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Fingerprint, MapPin, KeyRound, RefreshCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";

const AttendanceForm = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [inProgress, setInProgress] = useState(false);
  const [isWithinRadius, setIsWithinRadius] = useState<boolean | null>(null);
  const [passcode, setPasscode] = useState("");
  const [generatedPasscode, setGeneratedPasscode] = useState("");
  const [passcodeValid, setPasscodeValid] = useState<boolean | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

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
          
          // Generate random passcode for demo purposes
          generateRandomPasscode();
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

  const generateRandomPasscode = () => {
    // Generate a 6-digit passcode for demo
    const newPasscode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedPasscode(newPasscode);
    
    toast({
      title: "New Passcode Generated",
      description: `Your attendance passcode is: ${newPasscode}`,
    });
  };

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
          description: "You are outside the allowed radius for attendance",
        });
      }
      
      setLoading(false);
      setInProgress(false);
    }, 2000);
  };

  const handlePasscodeSubmit = (type: 'in' | 'out') => {
    setLoading(true);
    
    // In a real application, this would be validated against a server
    const isValid = passcode === generatedPasscode;
    setPasscodeValid(isValid);
    
    if (isValid) {
      const now = new Date();
      const attendanceRecord = {
        userId: user?.id || "1",
        name: user?.name || "User",
        date: now.toLocaleDateString(),
        time: now.toLocaleTimeString(),
        type: type === 'in' ? "Check In" : "Check Out",
        location: location,
        timestamp: now.getTime(),
        method: "Passcode"
      };
      
      // Store in local storage
      const existingRecords = JSON.parse(localStorage.getItem('attendanceRecords') || '[]');
      existingRecords.push(attendanceRecord);
      localStorage.setItem('attendanceRecords', JSON.stringify(existingRecords));
      
      toast({
        title: type === 'in' ? "Check-in Successful" : "Check-out Successful",
        description: `You have ${type === 'in' ? 'checked in' : 'checked out'} at ${now.toLocaleTimeString()} using passcode`,
      });
      
      // Reset form
      setPasscode("");
      setPasscodeValid(null);
    } else {
      toast({
        variant: "destructive",
        title: "Invalid Passcode",
        description: "The passcode you entered is incorrect. Please try again.",
      });
    }
    
    setLoading(false);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Record Attendance</CardTitle>
        <CardDescription>
          Use fingerprint authentication or passcode to punch in/out
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="fingerprint" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="fingerprint">Fingerprint</TabsTrigger>
            <TabsTrigger value="passcode">Passcode</TabsTrigger>
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
            </div>
          </TabsContent>
          
          <TabsContent value="passcode" className="space-y-4">
            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="relative">
                <div className={`w-40 h-40 rounded-full flex items-center justify-center ${
                  passcodeValid === true
                    ? "bg-green-100"
                    : passcodeValid === false
                    ? "bg-red-100"
                    : "bg-blue-100"
                }`}>
                  <KeyRound
                    className={`h-20 w-20 ${
                      passcodeValid === true
                        ? "text-green-500"
                        : passcodeValid === false
                        ? "text-red-500"
                        : "text-blue-500"
                    }`}
                  />
                </div>
              </div>

              <div className="w-full space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="passcode">Enter Attendance Passcode</Label>
                  <div className="flex gap-2">
                    <Input
                      id="passcode"
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      placeholder="Enter 6-digit code"
                      className="flex-1"
                      maxLength={6}
                    />
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={generateRandomPasscode}
                      title="Generate new passcode"
                    >
                      <RefreshCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="text-center text-sm">
                  <p>
                    Current passcode: <span className="font-bold">{generatedPasscode}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    (For demo purposes only - in a real app, this would be generated by admins)
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <Button
                    disabled={loading || !passcode}
                    onClick={() => handlePasscodeSubmit('in')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Check In
                  </Button>
                  <Button
                    disabled={loading || !passcode}
                    onClick={() => handlePasscodeSubmit('out')}
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
