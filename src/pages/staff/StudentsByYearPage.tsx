
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import RoleLayout from "@/components/RoleLayout";
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Search, UserRound, X, Filter, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const StudentsByYearPage = () => {
  const { departmentId, year, section } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Convert year parameter to display format
  const yearDisplay = year === "1st" ? "1st Year" : 
                     year === "2nd" ? "2nd Year" : 
                     year === "3rd" ? "3rd Year" : "4th Year";
  
  // Mock data for department
  const departmentName = departmentId === "cs" 
    ? "Computer Science & Engineering" 
    : departmentId === "ece" 
      ? "Electronics & Communication Engineering" 
      : departmentId === "mech" 
        ? "Mechanical Engineering" 
        : departmentId === "civil" 
          ? "Civil Engineering" 
          : "Information Technology";
  
  // Generate mock student data
  const generateStudents = () => {
    const students = [];
    const firstNames = ["John", "Jane", "Michael", "Emily", "David", "Sarah", "Robert", "Emma", "James", "Olivia"];
    const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis", "Garcia", "Wilson", "Anderson"];
    
    for (let i = 1; i <= 30; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      
      students.push({
        id: `${departmentId.toUpperCase()}${year[0]}${section}${i.toString().padStart(2, '0')}`,
        name: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@university.edu`,
        attendance: Math.floor(Math.random() * 21) + 80, // 80-100%
        cgpa: (Math.random() * 4 + 6).toFixed(2), // 6.00-10.00
        phone: `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      });
    }
    
    return students;
  };
  
  const students = generateStudents();
  
  // Filter students based on search query
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <RoleLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-2" 
              onClick={() => navigate(`/staff/departments/${departmentId}`)}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-staff-primary">
                {yearDisplay} - Section {section}
              </h1>
              <p className="text-muted-foreground">{departmentName}</p>
            </div>
          </div>
        </div>
        
        <Card className="border-staff-primary/20">
          <CardHeader>
            <CardTitle>Student List</CardTitle>
            <CardDescription>View and manage students in this batch</CardDescription>
            <div className="flex items-center mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search" 
                  placeholder="Search by name, ID, or email..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0"
                    onClick={() => setSearchQuery("")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="ml-2">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Sort by Name</DropdownMenuItem>
                  <DropdownMenuItem>Sort by ID</DropdownMenuItem>
                  <DropdownMenuItem>Sort by Attendance</DropdownMenuItem>
                  <DropdownMenuItem>Sort by CGPA</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="text-right">Attendance</TableHead>
                  <TableHead className="text-right">CGPA</TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-staff-accent flex items-center justify-center text-staff-primary text-sm font-semibold mr-2">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        {student.name}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{student.email}</TableCell>
                    <TableCell className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        student.attendance >= 90 ? 'bg-green-100 text-green-800' : 
                        student.attendance >= 80 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {student.attendance}%
                      </span>
                    </TableCell>
                    <TableCell className="text-right">{student.cgpa}/10</TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => navigate(`/staff/students/${student.id}`)}
                      >
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </RoleLayout>
  );
};

export default StudentsByYearPage;
