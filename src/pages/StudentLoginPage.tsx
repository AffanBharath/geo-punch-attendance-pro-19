
import { useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const StudentLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [department, setDepartment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password, "student");
      
      if (success) {
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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;

      if (user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            name,
            email,
            role: 'student',
            department,
            student_id: studentId,
          });

        if (profileError) throw profileError;

        toast({
          title: "Registration successful",
          description: "Welcome to SIST - MarkMe! Please check your email to verify your account.",
        });

        // Don't navigate yet - wait for email verification
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "An error occurred during registration. Please try again.",
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
            Login or create your student account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="student@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="border-student-primary/20 focus:border-student-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="student@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-student-primary/20 focus:border-student-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border-student-primary/20 focus:border-student-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student-id">Student ID</Label>
                  <Input
                    id="student-id"
                    type="text"
                    placeholder="CS2023001"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    required
                    className="border-student-primary/20 focus:border-student-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    type="text"
                    placeholder="Computer Science"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    required
                    className="border-student-primary/20 focus:border-student-primary"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-student-primary hover:bg-student-secondary" 
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Sign Up"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentLoginPage;
