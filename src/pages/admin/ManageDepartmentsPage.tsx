
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Edit, Plus, Search, Settings, PlusCircle } from "lucide-react";
import Layout from "@/components/Layout";

// Sample department data
const initialDepartments = [
  {
    id: "1",
    name: "Computer Science and Engineering",
    code: "CSE",
    hod: "Dr. John Smith",
    established: "2005",
    students: 450,
    description: "Department focused on computer science and software engineering education.",
  },
  {
    id: "2",
    name: "Electronics and Communication",
    code: "ECE",
    hod: "Dr. Sarah Johnson",
    established: "2000",
    students: 380,
    description: "Department specializing in electronics, communication systems, and signal processing.",
  },
  {
    id: "3",
    name: "Mechanical Engineering",
    code: "MECH",
    hod: "Dr. Michael Brown",
    established: "1995",
    students: 420,
    description: "Department covering all aspects of mechanical systems, design and manufacturing.",
  },
  {
    id: "4",
    name: "Information Technology",
    code: "IT",
    hod: "Dr. Emily Davis",
    established: "2008",
    students: 350,
    description: "Department focusing on information systems, networks, and data management.",
  },
];

interface Department {
  id: string;
  name: string;
  code: string;
  hod: string;
  established: string;
  students: number;
  description: string;
}

const ManageDepartmentsPage = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddingDepartment, setIsAddingDepartment] = useState(false);
  const [isEditingDepartment, setIsEditingDepartment] = useState(false);
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState<Department>({
    id: "",
    name: "",
    code: "",
    hod: "",
    established: "",
    students: 0,
    description: "",
  });
  
  const { toast } = useToast();

  useEffect(() => {
    // In a real app, this would be an API call
    // For demo, we use the sample data
    const storedDepartments = localStorage.getItem("departments");
    if (storedDepartments) {
      setDepartments(JSON.parse(storedDepartments));
    } else {
      setDepartments(initialDepartments);
      localStorage.setItem("departments", JSON.stringify(initialDepartments));
    }
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredDepartments = departments.filter(
    (department) =>
      department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      department.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      department.hod.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddDepartment = () => {
    if (validateDepartmentData()) {
      const newDepartment = {
        ...currentDepartment,
        id: (Math.max(0, ...departments.map((d) => parseInt(d.id))) + 1).toString(),
      };
      const updatedDepartments = [...departments, newDepartment];
      setDepartments(updatedDepartments);
      localStorage.setItem("departments", JSON.stringify(updatedDepartments));
      setIsAddingDepartment(false);
      resetForm();
      toast({
        title: "Department Added",
        description: "The department has been added successfully.",
      });
    }
  };

  const handleEditDepartment = () => {
    if (validateDepartmentData()) {
      const updatedDepartments = departments.map((dept) =>
        dept.id === currentDepartment.id ? currentDepartment : dept
      );
      setDepartments(updatedDepartments);
      localStorage.setItem("departments", JSON.stringify(updatedDepartments));
      setIsEditingDepartment(false);
      resetForm();
      toast({
        title: "Department Updated",
        description: "The department has been updated successfully.",
      });
    }
  };

  const handleDeleteDepartment = (id: string) => {
    const updatedDepartments = departments.filter((dept) => dept.id !== id);
    setDepartments(updatedDepartments);
    localStorage.setItem("departments", JSON.stringify(updatedDepartments));
    toast({
      title: "Department Deleted",
      description: "The department has been deleted successfully.",
    });
  };

  const validateDepartmentData = () => {
    if (!currentDepartment.name || !currentDepartment.code || !currentDepartment.hod) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill all required fields.",
      });
      return false;
    }
    return true;
  };

  const resetForm = () => {
    setCurrentDepartment({
      id: "",
      name: "",
      code: "",
      hod: "",
      established: "",
      students: 0,
      description: "",
    });
  };

  const openEditDialog = (department: Department) => {
    setCurrentDepartment(department);
    setIsEditingDepartment(true);
  };

  const toggleMaintenanceMode = () => {
    setIsMaintenanceMode(!isMaintenanceMode);
    toast({
      title: isMaintenanceMode ? "Maintenance Mode Disabled" : "Maintenance Mode Enabled",
      description: isMaintenanceMode 
        ? "The system is now accessible to all users." 
        : "The system is now in maintenance mode. Only administrators can access it.",
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Manage Departments</h1>
          <div className="flex gap-2">
            <Button 
              onClick={toggleMaintenanceMode}
              variant={isMaintenanceMode ? "destructive" : "outline"}
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              {isMaintenanceMode ? "Disable Maintenance Mode" : "Enable Maintenance Mode"}
            </Button>
            <Dialog open={isAddingDepartment} onOpenChange={setIsAddingDepartment}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Department
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add New Department</DialogTitle>
                  <DialogDescription>
                    Create a new department in the system.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Department Name</Label>
                      <Input
                        id="name"
                        value={currentDepartment.name}
                        onChange={(e) =>
                          setCurrentDepartment({
                            ...currentDepartment,
                            name: e.target.value,
                          })
                        }
                        placeholder="Department Name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="code">Department Code</Label>
                      <Input
                        id="code"
                        value={currentDepartment.code}
                        onChange={(e) =>
                          setCurrentDepartment({
                            ...currentDepartment,
                            code: e.target.value,
                          })
                        }
                        placeholder="e.g., CSE"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="hod">Head of Department</Label>
                      <Input
                        id="hod"
                        value={currentDepartment.hod}
                        onChange={(e) =>
                          setCurrentDepartment({
                            ...currentDepartment,
                            hod: e.target.value,
                          })
                        }
                        placeholder="HOD Name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="established">Year Established</Label>
                      <Input
                        id="established"
                        value={currentDepartment.established}
                        onChange={(e) =>
                          setCurrentDepartment({
                            ...currentDepartment,
                            established: e.target.value,
                          })
                        }
                        placeholder="e.g., 2005"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="students">Number of Students</Label>
                      <Input
                        id="students"
                        type="number"
                        value={currentDepartment.students}
                        onChange={(e) =>
                          setCurrentDepartment({
                            ...currentDepartment,
                            students: parseInt(e.target.value),
                          })
                        }
                        placeholder="e.g., 300"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={currentDepartment.description}
                      onChange={(e) =>
                        setCurrentDepartment({
                          ...currentDepartment,
                          description: e.target.value,
                        })
                      }
                      placeholder="Department description"
                      rows={4}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddingDepartment(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddDepartment}>Save Department</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Departments</CardTitle>
            <CardDescription>
              View and manage all departments in Sathyabama Institute.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search departments..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
            <Table>
              <TableCaption>A list of all departments.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Department</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>HOD</TableHead>
                  <TableHead className="text-right">Students</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDepartments.length > 0 ? (
                  filteredDepartments.map((department) => (
                    <TableRow key={department.id}>
                      <TableCell className="font-medium">{department.name}</TableCell>
                      <TableCell>{department.code}</TableCell>
                      <TableCell>{department.hod}</TableCell>
                      <TableCell className="text-right">{department.students}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(department)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteDepartment(department.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      No departments found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Edit Department Dialog */}
      <Dialog open={isEditingDepartment} onOpenChange={setIsEditingDepartment}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Department</DialogTitle>
            <DialogDescription>Update department information.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Department Name</Label>
                <Input
                  id="edit-name"
                  value={currentDepartment.name}
                  onChange={(e) =>
                    setCurrentDepartment({ ...currentDepartment, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-code">Department Code</Label>
                <Input
                  id="edit-code"
                  value={currentDepartment.code}
                  onChange={(e) =>
                    setCurrentDepartment({ ...currentDepartment, code: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-hod">Head of Department</Label>
                <Input
                  id="edit-hod"
                  value={currentDepartment.hod}
                  onChange={(e) =>
                    setCurrentDepartment({ ...currentDepartment, hod: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-established">Year Established</Label>
                <Input
                  id="edit-established"
                  value={currentDepartment.established}
                  onChange={(e) =>
                    setCurrentDepartment({
                      ...currentDepartment,
                      established: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-students">Number of Students</Label>
              <Input
                id="edit-students"
                type="number"
                value={currentDepartment.students}
                onChange={(e) =>
                  setCurrentDepartment({
                    ...currentDepartment,
                    students: parseInt(e.target.value),
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={currentDepartment.description}
                onChange={(e) =>
                  setCurrentDepartment({
                    ...currentDepartment,
                    description: e.target.value,
                  })
                }
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingDepartment(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditDepartment}>Update Department</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default ManageDepartmentsPage;
