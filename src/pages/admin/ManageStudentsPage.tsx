
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
  GraduationCap, Search, Plus, MoreHorizontal, Pencil, Trash2, Eye, FileSpreadsheet 
} from "lucide-react";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

interface Student {
  id: string;
  name: string;
  email: string;
  department: string;
  year: string;
  attendance: number;
  joinDate: string;
}

const ManageStudentsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const { toast } = useToast();

  // Mock student data
  const studentData: Student[] = [
    {
      id: "CS2023001",
      name: "Alex Johnson",
      email: "alex.johnson@example.com",
      department: "Computer Science",
      year: "2nd Year",
      attendance: 92,
      joinDate: "2023-08-01"
    },
    {
      id: "CS2023002",
      name: "Emma Thompson",
      email: "emma.thompson@example.com",
      department: "Computer Science",
      year: "1st Year",
      attendance: 88,
      joinDate: "2023-08-01"
    },
    {
      id: "MTH2023001",
      name: "Daniel Lee",
      email: "daniel.lee@example.com",
      department: "Mathematics",
      year: "3rd Year",
      attendance: 95,
      joinDate: "2021-08-15"
    },
    {
      id: "PHY2022005",
      name: "Sophia Martinez",
      email: "sophia.martinez@example.com",
      department: "Physics",
      year: "4th Year",
      attendance: 78,
      joinDate: "2020-08-10"
    },
    {
      id: "CHM2023003",
      name: "William Brown",
      email: "william.brown@example.com",
      department: "Chemistry",
      year: "2nd Year",
      attendance: 89,
      joinDate: "2022-08-12"
    },
    {
      id: "CS2023010",
      name: "Olivia Taylor",
      email: "olivia.taylor@example.com",
      department: "Computer Science",
      year: "1st Year",
      attendance: 72,
      joinDate: "2023-08-01"
    },
    {
      id: "MTH2022015",
      name: "James Wilson",
      email: "james.wilson@example.com",
      department: "Mathematics",
      year: "2nd Year",
      attendance: 80,
      joinDate: "2022-08-12"
    },
  ];

  const filteredStudents = studentData.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStudent = () => {
    // In a real application, this would send the data to a backend API
    toast({
      title: "Student Added",
      description: "New student has been added successfully.",
    });
    setIsAddDialogOpen(false);
  };

  const handleEditStudent = () => {
    // In a real application, this would update the data via a backend API
    toast({
      title: "Student Updated",
      description: `${selectedStudent?.name}'s information has been updated successfully.`,
    });
    setIsEditDialogOpen(false);
  };

  const handleDeleteStudent = () => {
    // In a real application, this would delete the data via a backend API
    toast({
      title: "Student Removed",
      description: `${selectedStudent?.name} has been removed from the system.`,
    });
    setIsDeleteDialogOpen(false);
  };

  // Group students by department for stats
  const departmentStats = filteredStudents.reduce((acc: Record<string, {count: number, avgAttendance: number}>, student) => {
    if (!acc[student.department]) {
      acc[student.department] = { count: 0, avgAttendance: 0 };
    }
    acc[student.department].count += 1;
    acc[student.department].avgAttendance += student.attendance;
    return acc;
  }, {});

  // Calculate average attendance for each department
  Object.keys(departmentStats).forEach(dept => {
    departmentStats[dept].avgAttendance = parseFloat((departmentStats[dept].avgAttendance / departmentStats[dept].count).toFixed(1));
  });

  return (
    <RoleLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight text-admin-primary">Manage Students</h1>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="border-admin-primary/20 text-admin-primary hover:bg-admin-accent/20"
            >
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button 
              onClick={() => setIsAddDialogOpen(true)} 
              className="bg-admin-primary hover:bg-admin-secondary"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Student
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="list">
          <TabsList className="mb-4">
            <TabsTrigger value="list">Student List</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list">
            <Card className="border-admin-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GraduationCap className="mr-2 h-5 w-5 text-admin-primary" />
                  <span>Student Directory</span>
                </CardTitle>
                <CardDescription>Manage students and their information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="relative flex-1 max-w-sm">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input 
                        placeholder="Search students..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select defaultValue="all">
                      <SelectTrigger className="ml-4 w-[180px]">
                        <SelectValue placeholder="Filter by Department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        <SelectItem value="computer-science">Computer Science</SelectItem>
                        <SelectItem value="mathematics">Mathematics</SelectItem>
                        <SelectItem value="physics">Physics</SelectItem>
                        <SelectItem value="chemistry">Chemistry</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead>Year</TableHead>
                          <TableHead>Attendance</TableHead>
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
                              <TableCell>{student.department}</TableCell>
                              <TableCell>{student.year}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Progress value={student.attendance} className="h-2 w-16" />
                                  <span className={`text-xs font-medium ${
                                    student.attendance >= 85 ? 'text-green-600' : 
                                    student.attendance >= 75 ? 'text-yellow-600' : 
                                    'text-red-600'
                                  }`}>
                                    {student.attendance}%
                                  </span>
                                </div>
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
                                    <DropdownMenuItem 
                                      onClick={() => {
                                        setSelectedStudent(student);
                                        setIsEditDialogOpen(true);
                                      }}
                                    >
                                      <Pencil className="mr-2 h-4 w-4" />
                                      <span>Edit</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      onClick={() => {
                                        setSelectedStudent(student);
                                        setIsDeleteDialogOpen(true);
                                      }}
                                      className="text-red-600"
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      <span>Delete</span>
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
          </TabsContent>
          
          <TabsContent value="stats">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-admin-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <GraduationCap className="mr-2 h-5 w-5 text-admin-primary" />
                    <span>Department Statistics</span>
                  </CardTitle>
                  <CardDescription>Student enrollment by department</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(departmentStats).map(([dept, stats], index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <p className="font-medium">{dept}</p>
                        <p className="text-sm font-medium">{stats.count} students</p>
                      </div>
                      <div className="space-y-1">
                        <Progress value={(stats.count / filteredStudents.length) * 100} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Avg. Attendance: {stats.avgAttendance}%</span>
                          <span>{((stats.count / filteredStudents.length) * 100).toFixed(1)}% of total</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
              
              <Card className="border-admin-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Fingerprint className="mr-2 h-5 w-5 text-admin-primary" />
                    <span>Attendance Overview</span>
                  </CardTitle>
                  <CardDescription>Student attendance statistics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="font-medium">Overall Attendance Rate</p>
                    <div className="flex justify-between items-center">
                      <Progress value={85} className="h-2 flex-1 mr-4" />
                      <span className="text-lg font-semibold">85%</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 pt-2">
                    <div className="p-4 bg-green-50 rounded-lg text-center">
                      <p className="text-2xl font-bold text-green-600">75%</p>
                      <p className="text-xs text-muted-foreground">Good Attendance{"\n"}({">"}{85}%)</p>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-lg text-center">
                      <p className="text-2xl font-bold text-yellow-600">20%</p>
                      <p className="text-xs text-muted-foreground">Average{"\n"}(75%-85%)</p>
                    </div>
                    <div className="p-4 bg-red-50 rounded-lg text-center">
                      <p className="text-2xl font-bold text-red-600">5%</p>
                      <p className="text-xs text-muted-foreground">Poor{"\n"}({"<"}75%)</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 pt-2">
                    <p className="font-medium">Attendance Trend</p>
                    <div className="h-32 bg-gray-50 rounded-lg flex items-end justify-between p-2">
                      {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, i) => {
                        // Generate random heights for the demo
                        const height = 70 + Math.floor(Math.random() * 20);
                        return (
                          <div key={day} className="flex flex-col items-center">
                            <div 
                              className="w-12 bg-admin-accent rounded-t"
                              style={{ height: `${height}%` }}
                            ></div>
                            <span className="text-xs mt-1">{day}</span>
                          </div>
                        );
                      })}
                    </div>
                    <p className="text-xs text-center text-muted-foreground pt-1">Last week attendance</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Student Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
            <DialogDescription>
              Enter the details for the new student
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="studentId">Student ID</Label>
                <Input id="studentId" placeholder="CS2023xxx" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Alex Johnson" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="alex.johnson@example.com" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="computer-science">Computer Science</SelectItem>
                    <SelectItem value="mathematics">Mathematics</SelectItem>
                    <SelectItem value="physics">Physics</SelectItem>
                    <SelectItem value="chemistry">Chemistry</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1st">1st Year</SelectItem>
                    <SelectItem value="2nd">2nd Year</SelectItem>
                    <SelectItem value="3rd">3rd Year</SelectItem>
                    <SelectItem value="4th">4th Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="joinDate">Join Date</Label>
              <Input id="joinDate" type="date" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button className="bg-admin-primary hover:bg-admin-secondary" onClick={handleAddStudent}>Add Student</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Student Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
            <DialogDescription>
              Update information for {selectedStudent?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editStudentId">Student ID</Label>
                <Input id="editStudentId" value={selectedStudent?.id} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editName">Full Name</Label>
                <Input id="editName" defaultValue={selectedStudent?.name} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="editEmail">Email</Label>
              <Input id="editEmail" type="email" defaultValue={selectedStudent?.email} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editDepartment">Department</Label>
                <Select defaultValue={selectedStudent?.department.toLowerCase().replace(' ', '-')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="computer-science">Computer Science</SelectItem>
                    <SelectItem value="mathematics">Mathematics</SelectItem>
                    <SelectItem value="physics">Physics</SelectItem>
                    <SelectItem value="chemistry">Chemistry</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editYear">Year</Label>
                <Select defaultValue={selectedStudent?.year.split(' ')[0].toLowerCase()}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1st">1st Year</SelectItem>
                    <SelectItem value="2nd">2nd Year</SelectItem>
                    <SelectItem value="3rd">3rd Year</SelectItem>
                    <SelectItem value="4th">4th Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button className="bg-admin-primary hover:bg-admin-secondary" onClick={handleEditStudent}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Student Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {selectedStudent?.name} from the system? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteStudent}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Student Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
            <DialogDescription>
              Detailed information about {selectedStudent?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex justify-center mb-4">
              <div className="h-24 w-24 rounded-full bg-admin-accent flex items-center justify-center text-admin-primary text-2xl font-semibold">
                {selectedStudent?.name.charAt(0)}
              </div>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Student ID</p>
                  <p className="font-medium">{selectedStudent?.id}</p>
                </div>
                <div className="col-span-2 space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                  <p className="font-medium">{selectedStudent?.name}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="font-medium">{selectedStudent?.email}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Department</p>
                  <p className="font-medium">{selectedStudent?.department}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Year</p>
                  <p className="font-medium">{selectedStudent?.year}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Attendance</p>
                <div className="flex items-center gap-2">
                  <Progress value={selectedStudent?.attendance} className="h-2 flex-1" />
                  <span className={`text-sm font-medium ${
                    (selectedStudent?.attendance || 0) >= 85 ? 'text-green-600' : 
                    (selectedStudent?.attendance || 0) >= 75 ? 'text-yellow-600' : 
                    'text-red-600'
                  }`}>
                    {selectedStudent?.attendance}%
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Join Date</p>
                <p className="font-medium">{selectedStudent?.joinDate}</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </RoleLayout>
  );
};

export default ManageStudentsPage;
