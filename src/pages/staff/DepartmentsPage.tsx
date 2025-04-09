
import { useState } from "react";
import RoleLayout from "@/components/RoleLayout";
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Building, ChevronRight, GraduationCap, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DepartmentsPage = () => {
  const navigate = useNavigate();
  
  // Department data
  const departments = [
    {
      id: "cs",
      name: "Computer Science & Engineering",
      hod: "Dr. Robert Smith",
      students: 152,
      staff: 24
    },
    {
      id: "ece",
      name: "Electronics & Communication Engineering",
      hod: "Dr. Emily Johnson",
      students: 145,
      staff: 20
    },
    {
      id: "mech",
      name: "Mechanical Engineering",
      hod: "Dr. Michael Brown",
      students: 130,
      staff: 18
    },
    {
      id: "civil",
      name: "Civil Engineering",
      hod: "Dr. Sarah Wilson",
      students: 120,
      staff: 15
    },
    {
      id: "it",
      name: "Information Technology",
      hod: "Dr. David Chen",
      students: 140,
      staff: 22
    }
  ];

  return (
    <RoleLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight text-staff-primary">Departments</h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {departments.map((department) => (
            <Card 
              key={department.id}
              className="border-staff-primary/20 hover:border-staff-primary transition-colors cursor-pointer"
              onClick={() => navigate(`/staff/departments/${department.id}`)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Building className="mr-2 h-5 w-5 text-staff-primary" />
                    <span>{department.name}</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </CardTitle>
                <CardDescription>HOD: {department.hod}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Users className="mr-2 h-4 w-4 text-staff-primary" />
                    <span className="text-sm">{department.staff} Staff</span>
                  </div>
                  <div className="flex items-center">
                    <GraduationCap className="mr-2 h-4 w-4 text-staff-primary" />
                    <span className="text-sm">{department.students} Students</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </RoleLayout>
  );
};

export default DepartmentsPage;
