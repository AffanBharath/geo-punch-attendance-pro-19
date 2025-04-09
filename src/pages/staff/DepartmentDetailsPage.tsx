
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import RoleLayout from "@/components/RoleLayout";
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Building, ChevronLeft, Users, GraduationCap, 
  MoveRight, Phone, Mail, BookOpen 
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DepartmentDetailsPage = () => {
  const { departmentId } = useParams();
  const navigate = useNavigate();
  
  // Mock data - In a real app this would come from an API call
  const departmentData = {
    id: departmentId,
    name: departmentId === "cs" 
      ? "Computer Science & Engineering" 
      : departmentId === "ece" 
        ? "Electronics & Communication Engineering" 
        : departmentId === "mech" 
          ? "Mechanical Engineering" 
          : departmentId === "civil" 
            ? "Civil Engineering" 
            : "Information Technology",
    hod: departmentId === "cs" 
      ? "Dr. Robert Smith" 
      : departmentId === "ece" 
        ? "Dr. Emily Johnson" 
        : departmentId === "mech" 
          ? "Dr. Michael Brown" 
          : departmentId === "civil" 
            ? "Dr. Sarah Wilson" 
            : "Dr. David Chen",
    students: 152,
    staff: 24,
    email: `${departmentId}@university.edu`,
    phone: "+1-555-123-4567",
    about: "The department offers undergraduate and postgraduate programs and is known for its cutting-edge research and industry collaborations.",
    courses: [
      "Data Structures & Algorithms",
      "Database Management Systems",
      "Web Development",
      "Artificial Intelligence",
      "Computer Networks"
    ]
  };
  
  // Year data for tabs
  const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

  return (
    <RoleLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-2" 
              onClick={() => navigate("/staff/departments")}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold tracking-tight text-staff-primary">
              {departmentData.name}
            </h1>
          </div>
        </div>
        
        <Card className="border-staff-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="mr-2 h-5 w-5 text-staff-primary" />
              <span>Department Overview</span>
            </CardTitle>
            <CardDescription>Key information about the department</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Head of Department</p>
                  <p className="font-medium">{departmentData.hod}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Contact Information</p>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-staff-primary" />
                      <p className="text-sm">{departmentData.email}</p>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-staff-primary" />
                      <p className="text-sm">{departmentData.phone}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-staff-accent/20 p-3 rounded-lg">
                    <p className="text-sm font-medium text-muted-foreground">Students</p>
                    <p className="text-2xl font-bold text-staff-primary flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      {departmentData.students}
                    </p>
                  </div>
                  <div className="bg-staff-accent/20 p-3 rounded-lg">
                    <p className="text-sm font-medium text-muted-foreground">Staff</p>
                    <p className="text-2xl font-bold text-staff-primary flex items-center">
                      <GraduationCap className="h-5 w-5 mr-2" />
                      {departmentData.staff}
                    </p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Core Courses</p>
                  <ul className="mt-2 space-y-1">
                    {departmentData.courses.map((course, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <BookOpen className="h-3.5 w-3.5 mr-2 text-staff-primary" />
                        {course}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-staff-primary/20">
          <CardHeader>
            <CardTitle>Student Batches</CardTitle>
            <CardDescription>Browse students by year of study</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="1st Year">
              <TabsList className="mb-4">
                {years.map((year) => (
                  <TabsTrigger key={year} value={year}>{year}</TabsTrigger>
                ))}
              </TabsList>
              
              {years.map((year) => (
                <TabsContent key={year} value={year} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {['A', 'B', 'C'].map((section) => (
                      <Link 
                        key={section}
                        to={`/staff/departments/${departmentId}/${year.split(' ')[0].toLowerCase()}/${section}`}
                        className="no-underline"
                      >
                        <Card className="border-staff-primary/20 hover:border-staff-primary transition-colors cursor-pointer h-full">
                          <CardHeader className="pb-2">
                            <CardTitle className="flex items-center justify-between">
                              <span>Section {section}</span>
                              <MoveRight className="h-4 w-4 text-muted-foreground" />
                            </CardTitle>
                            <CardDescription>
                              {year} {departmentData.name}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Total Students</span>
                              <span className="font-medium">{30 + Math.floor(Math.random() * 10)}</span>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </RoleLayout>
  );
};

export default DepartmentDetailsPage;
