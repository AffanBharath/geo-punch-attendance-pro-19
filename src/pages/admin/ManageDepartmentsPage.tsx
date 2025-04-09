import React, { useState } from 'react';
import RoleLayout from "@/components/RoleLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; 
import { useToast } from "@/hooks/use-toast";
import {
  Building,
  Search,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Users,
  GraduationCap,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface Department {
  id: string;
  name: string;
  code: string;
  hod: string;
  staffCount: number;
  studentCount: number;
  establishedYear: number;
  active: boolean;
}

const ManageDepartmentsPage = () => {
  const { toast } = useToast();
  const [departments, setDepartments] = useState<Department[]>([
    {
      id: "1",
      name: "Computer Science & Engineering",
      code: "CSE",
      hod: "Dr. Robert Smith",
      staffCount: 15,
      studentCount: 120,
      establishedYear: 2000,
      active: true,
    },
    {
      id: "2",
      name: "Electronics & Communication Engineering",
      code: "ECE",
      hod: "Dr. Jennifer Williams",
      staffCount: 12,
      studentCount: 90,
      establishedYear: 2002,
      active: true,
    },
    {
      id: "3",
      name: "Mechanical Engineering",
      code: "MECH",
      hod: "Dr. Michael Brown",
      staffCount: 18,
      studentCount: 110,
      establishedYear: 1995,
      active: true,
    },
    {
      id: "4",
      name: "Civil Engineering",
      code: "CIVIL",
      hod: "Dr. Emily Johnson",
      staffCount: 14,
      studentCount: 85,
      establishedYear: 1998,
      active: true,
    },
    {
      id: "5",
      name: "Electrical Engineering",
      code: "EEE",
      hod: "Dr. Thomas Wilson",
      staffCount: 16,
      studentCount: 95,
      establishedYear: 1997,
      active: false,
    },
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [addDepartmentOpen, setAddDepartmentOpen] = useState(false);
  const [editDepartmentOpen, setEditDepartmentOpen] = useState(false);
  const [deleteDepartmentOpen, setDeleteDepartmentOpen] = useState(false);
  const [systemMaintenanceOpen, setSystemMaintenanceOpen] = useState(false);
  
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState(
    "The system is currently under maintenance. Please try again later."
  );
  
  const [departmentForm, setDepartmentForm] = useState({
    name: '',
    code: '',
    hod: '',
    establishedYear: new Date().getFullYear(),
  });
  
  const [currentDepartment, setCurrentDepartment] = useState<Department | null>(null);
  
  const filteredDepartments = departments.filter((dept) => {
    return (
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.hod.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  
  const handleAddDepartment = () => {
    if (!departmentForm.name || !departmentForm.code || !departmentForm.hod) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }
    
    const newDepartment: Department = {
      id: `${departments.length + 1}`,
      name: departmentForm.name,
      code: departmentForm.code.toUpperCase(),
      hod: departmentForm.hod,
      staffCount: 0,
      studentCount: 0,
      establishedYear: departmentForm.establishedYear,
      active: true,
    };
    
    setDepartments([...departments, newDepartment]);
    setAddDepartmentOpen(false);
    
    toast({
      title: "Department Added",
      description: `${newDepartment.name} department has been added successfully`,
    });
    
    setDepartmentForm({
      name: '',
      code: '',
      hod: '',
      establishedYear: new Date().getFullYear(),
    });
  };
  
  const handleEditDepartment = (department: Department) => {
    setCurrentDepartment(department);
    setDepartmentForm({
      name: department.name,
      code: department.code,
      hod: department.hod,
      establishedYear: department.establishedYear,
    });
    setEditDepartmentOpen(true);
  };
  
  const handleUpdateDepartment = () => {
    if (!currentDepartment) return;
    
    if (!departmentForm.name || !departmentForm.code || !departmentForm.hod) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }
    
    const updatedDepartments = departments.map(dept => {
      if (dept.id === currentDepartment.id) {
        return {
          ...dept,
          name: departmentForm.name,
          code: departmentForm.code.toUpperCase(),
          hod: departmentForm.hod,
          establishedYear: departmentForm.establishedYear,
        };
      }
      return dept;
    });
    
    setDepartments(updatedDepartments);
    setEditDepartmentOpen(false);
    
    toast({
      title: "Department Updated",
      description: `${departmentForm.name} department has been updated successfully`,
    });
    
    setCurrentDepartment(null);
    setDepartmentForm({
      name: '',
      code: '',
      hod: '',
      establishedYear: new Date().getFullYear(),
    });
  };
  
  const handleDeleteDepartmentConfirm = (department: Department) => {
    setCurrentDepartment(department);
    setDeleteDepartmentOpen(true);
  };
  
  const handleDeleteDepartment = () => {
    if (!currentDepartment) return;
    
    const updatedDepartments = departments.filter(dept => dept.id !== currentDepartment.id);
    setDepartments(updatedDepartments);
    setDeleteDepartmentOpen(false);
    
    toast({
      title: "Department Deleted",
      description: `${currentDepartment.name} department has been deleted successfully`,
    });
    
    setCurrentDepartment(null);
  };
  
  const handleToggleDepartmentStatus = (department: Department) => {
    const updatedDepartments = departments.map(dept => {
      if (dept.id === department.id) {
        return {
          ...dept,
          active: !dept.active,
        };
      }
      return dept;
    });
    
    setDepartments(updatedDepartments);
    
    toast({
      title: `Department ${department.active ? 'Deactivated' : 'Activated'}`,
      description: `${department.name} department has been ${department.active ? 'deactivated' : 'activated'}`,
    });
  };
  
  const handleMaintenanceModeToggle = () => {
    const newMode = !maintenanceMode;
    setMaintenanceMode(newMode);
    
    if (newMode) {
      toast({
        title: "Maintenance Mode Enabled",
        description: "The system is now in maintenance mode. Users will see maintenance message.",
      });
    } else {
      toast({
        title: "Maintenance Mode Disabled",
        description: "The system is now operating normally.",
      });
    }
    
    setSystemMaintenanceOpen(false);
  };

  return (
    <RoleLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight text-admin-primary">Manage Departments</h1>
          <div className="space-x-2">
            <Button
              variant="outline"
              onClick={() => setSystemMaintenanceOpen(true)}
              className={`${
                maintenanceMode ? 'bg-yellow-100 text-yellow-800 border-yellow-300' : ''
              }`}
            >
              {maintenanceMode ? 'System in Maintenance' : 'Maintenance Mode'}
            </Button>
            <Button
              className="bg-admin-primary hover:bg-admin-primary/90"
              onClick={() => setAddDepartmentOpen(true)}
            >
              <Plus className="mr-1 h-4 w-4" /> Add Department
            </Button>
          </div>
        </div>
        
        <Card className="border-admin-primary/20">
          <CardHeader className="pb-3">
            <CardTitle>Departments</CardTitle>
            <CardDescription>
              Manage academic departments within the institution
            </CardDescription>
            <div className="flex mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search departments..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredDepartments.length === 0 ? (
                <p className="text-center py-6 text-muted-foreground">No departments found</p>
              ) : (
                <div className="rounded-md border">
                  <div className="grid grid-cols-12 p-4 bg-muted/50 text-sm font-medium">
                    <div className="col-span-4">Department</div>
                    <div className="col-span-2 text-center">Code</div>
                    <div className="col-span-2 text-center">HOD</div>
                    <div className="col-span-1 text-center">Staff</div>
                    <div className="col-span-1 text-center">Students</div>
                    <div className="col-span-1 text-center">Status</div>
                    <div className="col-span-1 text-center">Actions</div>
                  </div>
                  
                  {filteredDepartments.map((department) => (
                    <div
                      key={department.id}
                      className="grid grid-cols-12 p-4 border-t items-center text-sm"
                    >
                      <div className="col-span-4 font-medium">{department.name}</div>
                      <div className="col-span-2 text-center">{department.code}</div>
                      <div className="col-span-2 text-center">{department.hod}</div>
                      <div className="col-span-1 text-center">{department.staffCount}</div>
                      <div className="col-span-1 text-center">{department.studentCount}</div>
                      <div className="col-span-1 text-center">
                        <Badge className={department.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                          {department.active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="col-span-1 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditDepartment(department)}>
                              <Pencil className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleDepartmentStatus(department)}>
                              {department.active ? (
                                <>
                                  <Trash2 className="mr-2 h-4 w-4" /> Deactivate
                                </>
                              ) : (
                                <>
                                  <Building className="mr-2 h-4 w-4" /> Activate
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteDepartmentConfirm(department)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between pt-4">
            <div className="text-sm text-muted-foreground">
              Total: {filteredDepartments.length} departments
            </div>
          </CardFooter>
        </Card>
      </div>
      
      <Dialog open={addDepartmentOpen} onOpenChange={setAddDepartmentOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Department</DialogTitle>
            <DialogDescription>
              Create a new department in the system
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="dept-name">Department Name</Label>
              <Input
                id="dept-name"
                placeholder="e.g., Computer Science & Engineering"
                value={departmentForm.name}
                onChange={(e) => setDepartmentForm({ ...departmentForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dept-code">Department Code</Label>
              <Input
                id="dept-code"
                placeholder="e.g., CSE"
                value={departmentForm.code}
                onChange={(e) => setDepartmentForm({ ...departmentForm, code: e.target.value })}
                maxLength={5}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dept-hod">Head of Department</Label>
              <Input
                id="dept-hod"
                placeholder="e.g., Dr. Robert Smith"
                value={departmentForm.hod}
                onChange={(e) => setDepartmentForm({ ...departmentForm, hod: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dept-year">Established Year</Label>
              <Input
                id="dept-year"
                type="number"
                value={departmentForm.establishedYear}
                onChange={(e) => setDepartmentForm({ ...departmentForm, establishedYear: parseInt(e.target.value) || new Date().getFullYear() })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDepartmentOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddDepartment}>
              Add Department
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={editDepartmentOpen} onOpenChange={setEditDepartmentOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Department</DialogTitle>
            <DialogDescription>
              Update department information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-dept-name">Department Name</Label>
              <Input
                id="edit-dept-name"
                value={departmentForm.name}
                onChange={(e) => setDepartmentForm({ ...departmentForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-dept-code">Department Code</Label>
              <Input
                id="edit-dept-code"
                value={departmentForm.code}
                onChange={(e) => setDepartmentForm({ ...departmentForm, code: e.target.value })}
                maxLength={5}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-dept-hod">Head of Department</Label>
              <Input
                id="edit-dept-hod"
                value={departmentForm.hod}
                onChange={(e) => setDepartmentForm({ ...departmentForm, hod: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-dept-year">Established Year</Label>
              <Input
                id="edit-dept-year"
                type="number"
                value={departmentForm.establishedYear}
                onChange={(e) => setDepartmentForm({ ...departmentForm, establishedYear: parseInt(e.target.value) || new Date().getFullYear() })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDepartmentOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateDepartment}>
              Update Department
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={deleteDepartmentOpen} onOpenChange={setDeleteDepartmentOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Department</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this department? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {currentDepartment && (
              <p>
                You are about to delete <strong>{currentDepartment.name}</strong> ({currentDepartment.code}).
                This will remove all associated data.
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDepartmentOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteDepartment}>
              Delete Department
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={systemMaintenanceOpen} onOpenChange={setSystemMaintenanceOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>System Maintenance Mode</DialogTitle>
            <DialogDescription>
              Enable maintenance mode to temporarily restrict system access
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="maintenance-mode"
                checked={maintenanceMode}
                onCheckedChange={setMaintenanceMode}
              />
              <Label htmlFor="maintenance-mode">
                {maintenanceMode ? "Disable Maintenance Mode" : "Enable Maintenance Mode"}
              </Label>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maintenance-message">Maintenance Message</Label>
              <Textarea
                id="maintenance-message"
                value={maintenanceMessage}
                onChange={(e) => setMaintenanceMessage(e.target.value)}
                placeholder="Message to display to users during maintenance"
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSystemMaintenanceOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleMaintenanceModeToggle}
              className={maintenanceMode ? "bg-green-600 hover:bg-green-700" : "bg-yellow-600 hover:bg-yellow-700"}
            >
              {maintenanceMode ? "Disable Maintenance Mode" : "Enable Maintenance Mode"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </RoleLayout>
  );
};

export default ManageDepartmentsPage;
