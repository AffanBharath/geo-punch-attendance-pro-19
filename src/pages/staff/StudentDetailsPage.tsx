
import RoleLayout from "@/components/RoleLayout";
import { useState } from "react";
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from "@/components/ui/card";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  GraduationCap, Search, MoreHorizontal, Eye, FileSpreadsheet 
} from "lucide-react";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface Student {
  id: string;
  name: string;
  email: string;
  courses: string[];
  attendance: number;
  lastAttendance: string;
}

const StudentDetailsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const { toast } = useToast();

  // Mock student data
  const studentData: Student[] = [
    {
      id: "CS2023001",
      name: "Alex Johnson",
      email: "alex.johnson@example.com",
      courses: ["Database Systems", "Web Development", "AI Fundamentals"],
      attendance: 92,
      lastAttendance: "Today, 09:15 AM"
    },
    {
      id: "CS2023002",
      name: "Emma Thompson",
      email: "emma.thompson@example.com",
      courses: ["Database Systems", "Mobile App Development", "Computer Networks"],
      attendance: 88,
      lastAttendance: "Today, 09:05 AM"
    },
    {
      id: "CS2023003",
      name: "Daniel Lee",
      email: "daniel.lee@example.com",
      courses: ["Web Development", "AI Fundamentals", "Computer Networks"],
      attendance: 95,
      lastAttendance: "Today, 09:10 AM"
    },
    {
      id: "CS2023004",
      name: "Sophia Martinez",
      email: "sophia.martinez@example.com",
      courses: ["Database Systems", "Web Development", "Mobile App Development"],
      attendance: 78,
      lastAttendance: "Yesterday, 09:15 AM"
    },
    {
      id: "CS2023005",
      name: "William Brown",
      email: "william.brown@example.com",
      courses: ["AI Fundamentals", "Mobile App Development", "Computer Networks"],
      attendance: 89,
      lastAttendance: "Today, 09:20 AM"
    },
    {
      id: "CS2023006",
      name: "Olivia Taylor",
      email: "olivia.taylor@example.com",
      courses: ["Database Systems", "Web Development", "Computer Networks"],
      attendance: 72,
      lastAttendance: "Yesterday, 09:10 AM"
    },
    {
      id: "CS2023007",
      name: "James Wilson",
      email: "james.wilson@example.com",
      courses: ["Database Systems", "AI Fundamentals", "Computer Networks"],
      attendance: 80,
      lastAttendance: "Today, 09:08 AM"
    },
  ];

  const filteredStudents = studentData.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.courses.some(course => course.toLowerCase().includes(searchTerm.toLowerCase())) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportData = () => {
    toast({
      title: "Export Initiated",
      description: "Student data export has been started. The file will be downloaded shortly.",
    });
  };

  // Mock attendance data for student view
  const generateAttendanceData = () => {
    const courses = selectedStudent?.courses || [];
    return courses.map(course => {
      // Generate random attendance percentage between 70 and 98
      const attendance = Math.floor(Math.random() * 28) + 70;
      
      // Generate mock class dates for the past 10 days
      const classDays = [];
      for (let i = 0; i < 10; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const status = Math.random() > 0.15 ? "Present" : "Absent"; // 15% chance of absence
        classDays.push({
          date: date.toLocaleDateString(),
          status
        });
      }
      
      return {
        course,
        attendance,
        classDays
      };
    });
  };

  return (
    <RoleLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight text-staff-primary">Student Details</h1>
          <Button 
            variant="outline" 
            onClick={handleExportData}
            className="border-staff-primary/20 text-staff-primary hover:bg-staff-accent/20"
          >
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
        
        <Card className="border-staff-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center">
              <GraduationCap className="mr-2 h-5 w-5 text-staff-primary" />
              <span>Students</span>
            </CardTitle>
            <CardDescription>View and manage students in your courses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input 
                    placeholder="Search students..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select defaultValue="all-courses">
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filter by Course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-courses">All Courses</SelectItem>
                    <SelectItem value="database-systems">Database Systems</SelectItem>
                    <SelectItem value="web-development">Web Development</SelectItem>
                    <SelectItem value="ai-fundamentals">AI Fundamentals</SelectItem>
                    <SelectItem value="mobile-app-development">Mobile App Development</SelectItem>
                    <SelectItem value="computer-networks">Computer Networks</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden md:table-cell">Courses</TableHead>
                      <TableHead>Attendance</TableHead>
                      <TableHead className="hidden md:table-cell">Last Attendance</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No students found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredStudents.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.id}</TableCell>
                          <TableCell>
                            <div>
                              <p>{student.name}</p>
                              <p className="text-xs text-muted-foreground">{student.email}</p>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex flex-wrap gap-1">
                              {student.courses.map((course, i) => (
                                <span 
                                  key={i} 
                                  className="text-xs bg-staff-accent/30 px-1.5 py-0.5 rounded"
                                >
                                  {course}
                                </span>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress 
                                value={student.attendance} 
                                className={`h-2 w-16 ${
                                  student.attendance >= 85 ? '' : 
                                  student.attendance >= 75 ? 'bg-yellow-100' : 
                                  'bg-red-100'
                                }`} 
                              />
                              <span className={`text-xs font-medium ${
                                student.attendance >= 85 ? 'text-green-600' : 
                                student.attendance >= 75 ? 'text-yellow-600' : 
                                'text-red-600'
                              }`}>
                                {student.attendance}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <span className="text-xs">{student.lastAttendance}</span>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem 
                                  onClick={() => {
                                    setSelectedStudent(student);
                                    setIsViewDialogOpen(true);
                                  }}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  <span>View Details</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View Student Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
            <DialogDescription>
              Detailed information and attendance records for {selectedStudent?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-2">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex justify-center sm:justify-start">
                <div className="h-24 w-24 rounded-full bg-staff-accent flex items-center justify-center text-staff-primary text-2xl font-semibold">
                  {selectedStudent?.name.charAt(0)}
                </div>
              </div>
              <div className="space-y-3 flex-1">
                <div>
                  <h3 className="text-xl font-semibold">{selectedStudent?.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedStudent?.id} • {selectedStudent?.email}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Overall Attendance</p>
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={selectedStudent?.attendance} 
                        className="h-2 flex-1" 
                      />
                      <span className={`text-sm font-medium ${
                        (selectedStudent?.attendance || 0) >= 85 ? 'text-green-600' : 
                        (selectedStudent?.attendance || 0) >= 75 ? 'text-yellow-600' : 
                        'text-red-600'
                      }`}>
                        {selectedStudent?.attendance}%
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Last Attendance</p>
                    <p className="font-medium">{selectedStudent?.lastAttendance}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Enrolled Courses</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedStudent?.courses.map((course, i) => (
                      <span 
                        key={i} 
                        className="text-sm bg-staff-accent/30 px-2 py-1 rounded"
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-medium mb-4">Course-wise Attendance</h4>
              <div className="space-y-6">
                {generateAttendanceData().map((courseData, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h5 className="font-medium">{courseData.course}</h5>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={courseData.attendance} 
                          className="h-2 w-24" 
                        />
                        <span className={`text-sm font-medium ${
                          courseData.attendance >= 85 ? 'text-green-600' : 
                          courseData.attendance >= 75 ? 'text-yellow-600' : 
                          'text-red-600'
                        }`}>
                          {courseData.attendance}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-5 gap-2">
                      {courseData.classDays.map((day, i) => (
                        <div 
                          key={i} 
                          className={`p-2 rounded text-center text-xs ${
                            day.status === "Present" 
                              ? "bg-green-50 text-green-700" 
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          <div>{day.date}</div>
                          <div className="font-medium">{day.status}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </RoleLayout>
  );
};

export default StudentDetailsPage;
