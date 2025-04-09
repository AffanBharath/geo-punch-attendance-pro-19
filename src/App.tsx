import { ToastProvider, ToastViewport } from "@/components/ui/toast";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Login Pages
import LoginPage from "./pages/LoginPage";
import StaffLoginPage from "./pages/StaffLoginPage";
import StudentLoginPage from "./pages/StudentLoginPage";
import AdminLoginPage from "./pages/AdminLoginPage";

// Dashboard Pages
import DashboardPage from "./pages/DashboardPage";
import StaffDashboardPage from "./pages/StaffDashboardPage";
import StudentDashboardPage from "./pages/StudentDashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";

// Other Pages
import AttendancePage from "./pages/AttendancePage";
import SalaryPage from "./pages/SalaryPage";
import ReportPage from "./pages/ReportPage";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";

// Admin Pages
import ManageStaffPage from "./pages/admin/ManageStaffPage";
import ManageStudentsPage from "./pages/admin/ManageStudentsPage";
import ManageDepartmentsPage from "./pages/admin/ManageDepartmentsPage";

// Staff Pages
import StudentDetailsPage from "./pages/staff/StudentDetailsPage";
import ODRequestsPage from "./pages/staff/ODRequestsPage";
import DepartmentsPage from "./pages/staff/DepartmentsPage";
import DepartmentDetailsPage from "./pages/staff/DepartmentDetailsPage";
import StudentsByYearPage from "./pages/staff/StudentsByYearPage";

// Student Pages
import ODPermissionPage from "./pages/student/ODPermissionPage";

const queryClient = new QueryClient();

// Auth guard component
const ProtectedRoute = ({ 
  children, 
  allowedRoles 
}: { 
  children: React.ReactNode;
  allowedRoles: Array<'admin' | 'staff' | 'student'>;
}) => {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }
  
  if (role && allowedRoles.includes(role)) {
    return <>{children}</>;
  }
  
  // If authenticated but wrong role, redirect to their dashboard
  if (role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  if (role === 'staff') return <Navigate to="/staff/dashboard" replace />;
  if (role === 'student') return <Navigate to="/student/dashboard" replace />;
  
  return <Navigate to="/" replace />;
};

// Component to redirect based on user role
const RoleRouter = () => {
  const { isAuthenticated, role } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  if (role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  if (role === 'staff') return <Navigate to="/staff/dashboard" replace />;
  if (role === 'student') return <Navigate to="/student/dashboard" replace />;
  
  return <Navigate to="/" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Landing/Login Routes */}
            <Route path="/" element={<LoginPage />} />
            <Route path="/login/staff" element={<StaffLoginPage />} />
            <Route path="/login/student" element={<StudentLoginPage />} />
            <Route path="/login/admin" element={<AdminLoginPage />} />
            
            {/* Role detection route */}
            <Route path="/dashboard" element={<RoleRouter />} />
            
            {/* Student Routes */}
            <Route 
              path="/student/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentDashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student/attendance" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <AttendancePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student/od-permission" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <ODPermissionPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student/courses" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <NotFound />
                </ProtectedRoute>
              } 
            />
            
            {/* Staff Routes */}
            <Route 
              path="/staff/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['staff']}>
                  <StaffDashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/staff/departments" 
              element={
                <ProtectedRoute allowedRoles={['staff']}>
                  <DepartmentsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/staff/departments/:departmentId" 
              element={
                <ProtectedRoute allowedRoles={['staff']}>
                  <DepartmentDetailsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/staff/departments/:departmentId/:year/:section" 
              element={
                <ProtectedRoute allowedRoles={['staff']}>
                  <StudentsByYearPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/staff/students" 
              element={
                <ProtectedRoute allowedRoles={['staff']}>
                  <StudentDetailsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/staff/students/:studentId" 
              element={
                <ProtectedRoute allowedRoles={['staff']}>
                  <StudentDetailsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/staff/attendance" 
              element={
                <ProtectedRoute allowedRoles={['staff']}>
                  <AttendancePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/staff/od-requests" 
              element={
                <ProtectedRoute allowedRoles={['staff']}>
                  <ODRequestsPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin Routes */}
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/manage-staff" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ManageStaffPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/manage-students" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ManageStudentsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/manage-departments" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ManageDepartmentsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/reports" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ReportPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Shared Routes */}
            <Route 
              path="/salary" 
              element={
                <ProtectedRoute allowedRoles={['staff', 'admin']}>
                  <SalaryPage />
                </ProtectedRoute>
              } 
            />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
