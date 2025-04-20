import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Users, ChevronLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const StaffLoginPage = () => {
  const [staffCode, setStaffCode] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // For demo purposes, we'll still use the email format behind the scenes
      // In a real implementation, you'd modify the authentication backend
      const email = `${staffCode}@sist.edu`; // Convert staff code to email format
      const success = await login(email, password, "staff");
      
      if (success) {
        toast({
          title: "Login successful",
          description: "Welcome to SIST - MarkMe Staff Portal!",
        });
        
        navigate("/staff/dashboard");
      } else {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Please enter valid staff credentials",
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
      // For demo purposes, convert staff code to email
      const email = `${staffCode}@sist.edu`;
      
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
        description: "An error occurred. Please verify your staff code and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-sky-50 p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between mb-2">
            <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-staff-primary">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back
            </Link>
            <div className="w-12 h-12 rounded-full bg-staff-accent flex items-center justify-center">
              <Users className="h-6 w-6 text-staff-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center text-staff-primary">Staff Portal</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the staff dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {forgotPassword ? (
            <form onSubmit={handleForgotPassword}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="staffCode">Staff Code</Label>
                  <Input
                    id="staffCode"
                    placeholder="Enter your staff code"
                    value={staffCode}
                    onChange={(e) => setStaffCode(e.target.value)}
                    required
                    className="border-staff-primary/20 focus:border-staff-primary"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-staff-primary hover:bg-staff-secondary" 
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
              </div>
            </form>
          ) : (
            <form onSubmit={handleLogin}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="staffCode">Staff Code</Label>
                  <Input
                    id="staffCode"
                    placeholder="Enter your staff code"
                    value={staffCode}
                    onChange={(e) => setStaffCode(e.target.value)}
                    required
                    className="border-staff-primary/20 focus:border-staff-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border-staff-primary/20 focus:border-staff-primary"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-staff-primary hover:bg-staff-secondary" 
                  disabled={isLoading}
                >
                  {isLoading ? "Authenticating..." : "Sign In"}
                </Button>
                <div className="text-xs text-center text-muted-foreground mt-2">
                  Demo credentials: STAFF001 / password
                </div>
                <Button
                  type="button"
                  variant="link"
                  className="w-full mt-2 text-staff-primary"
                  onClick={() => setForgotPassword(true)}
                >
                  Forgot Password?
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffLoginPage;
