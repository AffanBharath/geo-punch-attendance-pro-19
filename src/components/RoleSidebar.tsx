import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  UserRound, LogOut, ArrowLeft, ArrowRight, 
  Fingerprint, FileSpreadsheet, Users, BookOpen,
  Settings, Shield, GraduationCap, Calendar, ClipboardList, Building
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth, UserRole, AppUser } from "@/contexts/AuthContext";

interface RoleSidebarProps {
  role: UserRole;
}

const RoleSidebar = ({ role }: RoleSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    
    toast({
      title: "Logged out successfully",
      description: "You have been logged out from the system.",
    });
    
    navigate("/");
  };

  // Role-specific menu items
  const getMenuItems = () => {
    switch (role) {
      case 'admin':
        return [
          {
            title: "Dashboard",
            icon: <Shield className="h-5 w-5" />,
            path: "/admin/dashboard",
          },
          {
            title: "Manage Staff",
            icon: <Users className="h-5 w-5" />,
            path: "/admin/manage-staff",
          },
          {
            title: "Manage Students",
            icon: <GraduationCap className="h-5 w-5" />,
            path: "/admin/manage-students",
          },
          {
            title: "Manage Departments",
            icon: <Building className="h-5 w-5" />,
            path: "/admin/manage-departments",
          },
          {
            title: "Reports",
            icon: <FileSpreadsheet className="h-5 w-5" />,
            path: "/admin/reports",
          }
        ];
      case 'staff':
        return [
          {
            title: "Dashboard",
            icon: <UserRound className="h-5 w-5" />,
            path: "/staff/dashboard",
          },
          {
            title: "Departments",
            icon: <Building className="h-5 w-5" />,
            path: "/staff/departments",
          },
          {
            title: "Students",
            icon: <GraduationCap className="h-5 w-5" />,
            path: "/staff/students",
          },
          {
            title: "My Attendance",
            icon: <Fingerprint className="h-5 w-5" />,
            path: "/staff/attendance",
          },
          {
            title: "OD Requests",
            icon: <ClipboardList className="h-5 w-5" />,
            path: "/staff/od-requests",
          },
          {
            title: "Salary",
            icon: <Calendar className="h-5 w-5" />,
            path: "/salary",
          }
        ];
      case 'student':
        return [
          {
            title: "Dashboard",
            icon: <UserRound className="h-5 w-5" />,
            path: "/student/dashboard",
          },
          {
            title: "Attendance",
            icon: <Fingerprint className="h-5 w-5" />,
            path: "/student/attendance",
          },
          {
            title: "Courses",
            icon: <BookOpen className="h-5 w-5" />,
            path: "/student/courses",
          },
          {
            title: "OD Permission",
            icon: <ClipboardList className="h-5 w-5" />,
            path: "/student/od-permission",
          }
        ];
      default:
        return [];
    }
  };

  // Role-specific colors
  const getRoleColor = () => {
    switch (role) {
      case 'admin':
        return 'admin-primary';
      case 'staff':
        return 'staff-primary';
      case 'student':
        return 'student-primary';
      default:
        return 'primary';
    }
  };

  const menuItems = getMenuItems();
  const roleColor = getRoleColor();

  return (
    <div
      className={cn(
        "h-screen bg-sidebar transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className={`flex items-center justify-between p-4 border-b border-sidebar-border bg-${roleColor} text-white`}>
        {!collapsed && (
          <h1 className="font-bold text-lg">
            SIST - MarkMe!
          </h1>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-white hover:bg-white/20"
        >
          {collapsed ? (
            <ArrowRight className="h-5 w-5" />
          ) : (
            <ArrowLeft className="h-5 w-5" />
          )}
        </Button>
      </div>

      <div className="flex-1 py-4 overflow-y-auto">
        {!collapsed && (
          <div className="px-4 mb-6">
            <div className="flex items-center space-x-3 mb-2">
              <div className={`h-8 w-8 rounded-full bg-${roleColor} flex items-center justify-center text-white`}>
                {user?.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="font-medium truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{role}</p>
              </div>
            </div>
          </div>
        )}

        <nav className="px-2 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center text-sidebar-foreground hover:bg-sidebar-accent rounded-md",
                location.pathname === item.path
                  ? `bg-${roleColor} text-white`
                  : "text-sidebar-foreground",
                collapsed ? "justify-center p-3" : "px-4 py-3"
              )}
            >
              {item.icon}
              {!collapsed && <span className="ml-3">{item.title}</span>}
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className={cn(
            "w-full text-sidebar-foreground hover:bg-sidebar-accent",
            collapsed ? "justify-center" : "justify-start"
          )}
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span className="ml-2">Logout</span>}
        </Button>
      </div>
    </div>
  );
};

export default RoleSidebar;
