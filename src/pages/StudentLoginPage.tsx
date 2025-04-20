
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { UserRound, ChevronLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const StudentLoginPage = () => {
  const [registerNumber, setRegisterNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [ipAddress, setIpAddress] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();

  // Get client IP for fraud prevention
  useEffect(() => {
    const getClientIP = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        setIpAddress(data.ip);
        // Store in localStorage for checking
        localStorage.setItem('userIP', data.ip);
      } catch (error) {
        console.error('Error fetching IP', error);
      }
    };
    
    getClientIP();
    
    // Check if current IP matches stored IP
    const checkPreviousLogin = () => {
      const previousLoginIP = localStorage.getItem('lastLoginIP');
      const currentUserID = localStorage.getItem('currentUserID');
      // If different user is trying to login from same device
      if (previousLoginIP && currentUserID && previousLoginIP === ipAddress) {
        console.log('Same device used for multiple logins detected');
      }
    };
    
    if (ipAddress) {
      checkPreviousLogin();
    }
  }, [ipAddress]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // For demo purposes, we'll still use the email format behind the scenes
      // In a real implementation, you'd modify the authentication backend
      const email = `${registerNumber}@sist.edu`; // Convert register number to email format
      const success = await login(email, password, "student");
      
      if (success) {
        // Record login IP and time for security
        if (ipAddress) {
          localStorage.setItem('lastLoginIP', ipAddress);
          localStorage.setItem('lastLoginTime', new Date().toISOString());
        }
        
        toast({
          title: "Login successful",
          description: "Welcome to SIST - MarkMe Student Portal!",
        });
        
        navigate("/student/dashboard");
      } else {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Please enter valid student credentials",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login error",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // For demo purposes, convert register number to email
      const email = `${registerNumber}@sist.edu`;
      
      // Call Supabase password reset
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Password reset email sent",
        description: "Please check your email to reset your password.",
      });
      
      setForgotPassword(false);
    } catch (error) {
      console.error('Reset password error:', error);
      toast({
        variant: "destructive",
        title: "Password reset failed",
        description: "An error occurred. Please verify your register number and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50 p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between mb-2">
            <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-student-primary">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back
            </Link>
            <div className="w-12 h-12 rounded-full bg-student-accent flex items-center justify-center">
              <UserRound className="h-6 w-6 text-student-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center text-student-primary">Student Portal</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          {forgotPassword ? (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-number">Register Number</Label>
                <Input
                  id="register-number"
                  placeholder="Enter your register number"
                  value={registerNumber}
                  onChange={(e) => setRegisterNumber(e.target.value)}
                  required
                  className="border-student-primary/20 focus:border-student-primary"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-student-primary hover:bg-student-secondary" 
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Reset Password"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full mt-2"
                onClick={() => setForgotPassword(false)}
              >
                Back to Login
              </Button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-number">Register Number</Label>
                <Input
                  id="register-number"
                  placeholder="Enter your register number"
                  value={registerNumber}
                  onChange={(e) => setRegisterNumber(e.target.value)}
                  required
                  className="border-student-primary/20 focus:border-student-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-student-primary/20 focus:border-student-primary"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-student-primary hover:bg-student-secondary" 
                disabled={isLoading}
              >
                {isLoading ? "Authenticating..." : "Sign In"}
              </Button>
              <div className="text-xs text-center text-muted-foreground mt-2">
                Demo credentials: CS22001 / password
              </div>
              <Button
                type="button"
                variant="link"
                className="w-full mt-2 text-student-primary"
                onClick={() => setForgotPassword(true)}
              >
                Forgot Password?
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentLoginPage;
