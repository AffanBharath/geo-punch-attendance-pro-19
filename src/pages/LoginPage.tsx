import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { Users, UserRound, Shield } from "lucide-react";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center p-4" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1986&auto=format&fit=crop')" }}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      <Card className="w-full max-w-md mx-auto relative z-10 bg-white/95">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <img 
              src="/lovable-uploads/44a5b4d3-d9ef-4098-b060-715cfbfdea5a.png" 
              alt="Sathyabama Institute of Science and Technology" 
              className="h-28 w-auto"
            />
          </div>
          <CardTitle className="text-2xl text-center">SIST - MarkMe!</CardTitle>
          <CardDescription className="text-center">
            Choose your portal to login
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          
          <div className="grid grid-cols-1 gap-4">
            <Link to="/login/student">
              <Button 
                variant="outline" 
                className="w-full h-24 flex flex-col items-center justify-center gap-2 hover:bg-student-accent hover:text-student-primary transition-all"
              >
                <UserRound className="h-6 w-6 text-student-primary" />
                <div>
                  <p className="font-medium">Student Portal</p>
                  <p className="text-xs text-muted-foreground">For students to mark attendance</p>
                </div>
              </Button>
            </Link>

            <Link to="/login/staff">
              <Button 
                variant="outline" 
                className="w-full h-24 flex flex-col items-center justify-center gap-2 hover:bg-staff-accent hover:text-staff-primary transition-all"
              >
                <Users className="h-6 w-6 text-staff-primary" />
                <div>
                  <p className="font-medium">Staff Portal</p>
                  <p className="text-xs text-muted-foreground">For faculty and staff members</p>
                </div>
              </Button>
            </Link>

            <Link to="/login/admin">
              <Button 
                variant="outline" 
                className="w-full h-24 flex flex-col items-center justify-center gap-2 hover:bg-admin-accent hover:text-admin-primary transition-all"
              >
                <Shield className="h-6 w-6 text-admin-primary" />
                <div>
                  <p className="font-medium">Admin Portal</p>
                  <p className="text-xs text-muted-foreground">For system administrators</p>
                </div>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
