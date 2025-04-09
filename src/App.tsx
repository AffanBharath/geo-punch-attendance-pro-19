import { ToastProvider, ToastViewport } from "@/components/ui/toast";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
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
import ReportsPage from "./pages/ReportsPage";
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
import CoursesPage from "./pages/student/CoursesPage";

// Create a maintenance mode context
import React from "react";

interface MaintenanceContextType {
  isMaintenanceMode: boolean;
  setMaintenanceMode: (value: boolean) => void;
}

export const MaintenanceContext = React.createContext<MaintenanceContextType>({
  isMaintenanceMode: false,
  setMaintenanceMode: () => {},
});

export const MaintenanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMaintenanceMode, setMaintenanceMode] = useState(false);
  
  return (
    <MaintenanceContext.Provider value={{ isMaintenanceMode, setMaintenanceMode }}>
      {children}
    </MaintenanceContext.Provider>
  );
};

const queryClient = new QueryClient();

// Maintenance Mode Page
const MaintenancePage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="bg-white shadow-lg rounded-lg max-w-md w-full p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">System Maintenance</h1>
        <div className="rounded-full w-24 h-24 bg-red-100 mx-auto flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
            <path d="M10.3 21H8.7c-1-.1-1.7-.9-1.7-1.9V19" />
            <path d="M17 19v.1c0 1-.7 1.8-1.7 1.9h-1.6" />
            <path d="M3 11v-1h18v1" />
            <path d="M13 9V3h4l2 2-2 2" />
            <path d="M13 3l-4 4" />
            <path d="M9 7h4" />
            <path d="M9 17a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2H9v2Z" />
          </svg>
        </div>
        <p className="text-gray-700 mb-6">
          The system is currently undergoing maintenance. We apologize for any inconvenience this may cause. Please try again later.
        </p>
        <p className="text-sm text-gray-500">
          If you need immediate assistance, please contact the IT support team.
        </p>
      </div>
    </div>
  );
};

// Auth guard component with maintenance mode check
const ProtectedRoute = ({ 
  children, 
  allowedRoles,
  staffOrStudent = false
}: { 
  children: React.ReactNode;
  allowedRoles: Array<'admin' | 'staff' | 'student'>;
  staffOrStudent?: boolean;
}) => {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();
  const { isMaintenanceMode } = React.useContext(MaintenanceContext);
  
  // Check maintenance mode first for staff and student routes
  if (isMaintenanceMode && staffOrStudent && role !== 'admin') {
    return <MaintenancePage />;
  }
  
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
      <MaintenanceProvider>
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
                  <ProtectedRoute allowedRoles={['student']} staffOrStudent={true}>
                    <StudentDashboardPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/student/attendance" 
                element={
                  <ProtectedRoute allowedRoles={['student']} staffOrStudent={true}>
                    <AttendancePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/student/od-permission" 
                element={
                  <ProtectedRoute allowedRoles={['student']} staffOrStudent={true}>
                    <ODPermissionPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/student/courses" 
                element={
                  <ProtectedRoute allowedRoles={['student']} staffOrStudent={true}>
                    <CoursesPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/student/reports" 
                element={
                  <ProtectedRoute allowedRoles={['student']} staffOrStudent={true}>
                    <ReportsPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Staff Routes */}
              <Route 
                path="/staff/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['staff']} staffOrStudent={true}>
                    <StaffDashboardPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/staff/departments" 
                element={
                  <ProtectedRoute allowedRoles={['staff']} staffOrStudent={true}>
                    <DepartmentsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/staff/departments/:departmentId" 
                element={
                  <ProtectedRoute allowedRoles={['staff']} staffOrStudent={true}>
                    <DepartmentDetailsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/staff/departments/:departmentId/:year/:section" 
                element={
                  <ProtectedRoute allowedRoles={['staff']} staffOrStudent={true}>
                    <StudentsByYearPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/staff/students" 
                element={
                  <ProtectedRoute allowedRoles={['staff']} staffOrStudent={true}>
                    <StudentDetailsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/staff/students/:studentId" 
                element={
                  <ProtectedRoute allowedRoles={['staff']} staffOrStudent={true}>
                    <StudentDetailsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/staff/attendance" 
                element={
                  <ProtectedRoute allowedRoles={['staff']} staffOrStudent={true}>
                    <AttendancePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/staff/od-requests" 
                element={
                  <ProtectedRoute allowedRoles={['staff']} staffOrStudent={true}>
                    <ODRequestsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/staff/reports" 
                element={
                  <ProtectedRoute allowedRoles={['staff']} staffOrStudent={true}>
                    <ReportsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/staff/salary" 
                element={
                  <ProtectedRoute allowedRoles={['staff']} staffOrStudent={true}>
                    <SalaryPage />
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
                    <ReportsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/reports" 
                element={<Navigate to="/admin/reports" replace />} 
              />
              
              {/* Shared Routes - only for staff and admin */}
              <Route 
                path="/salary" 
                element={
                  <ProtectedRoute allowedRoles={['staff', 'admin']} staffOrStudent={true}>
                    <SalaryPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </MaintenanceProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
