
import Layout from "@/components/Layout";
import MaintenanceMode from "@/components/MaintenanceMode";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Users, GraduationCap, Building, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminDashboardPage = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* First column with maintenance mode card */}
          <div className="md:col-span-1">
            <MaintenanceMode />
          </div>
          
          {/* Stats and quick links */}
          <div className="md:col-span-2 space-y-6">
            {/* Stats cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">42</div>
                  <p className="text-xs text-muted-foreground">
                    +3 this month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">528</div>
                  <p className="text-xs text-muted-foreground">
                    +18 this month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Departments</CardTitle>
                  <Building className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">6</div>
                  <p className="text-xs text-muted-foreground">
                    No change
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-muted-foreground">
                    +2 this semester
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Action Cards */}
            <div className="grid grid-cols-1 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Manage your institution resources</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button 
                    onClick={() => navigate('/admin/manage-staff')}
                    className="justify-between"
                    variant="outline"
                  >
                    <span className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Manage Staff
                    </span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                  <Button 
                    onClick={() => navigate('/admin/manage-students')}
                    className="justify-between"
                    variant="outline"
                  >
                    <span className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      Manage Students
                    </span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                  <Button 
                    onClick={() => navigate('/admin/manage-departments')}
                    className="justify-between"
                    variant="outline"
                  >
                    <span className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Manage Departments
                    </span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                  <Button 
                    onClick={() => navigate('/admin/reports')}
                    className="justify-between"
                    variant="outline"
                  >
                    <span className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      View Reports
                    </span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboardPage;
