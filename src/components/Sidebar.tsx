
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Calendar,
  FileText,
  FileSpreadsheet,
  Fingerprint,
  LogOut,
  UserRound,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('geoAttendanceUser');
    
    toast({
      title: "Logged out successfully",
      description: "You have been logged out from the system.",
    });
    
    navigate("/");
  };

  const menuItems = [
    {
      title: "Dashboard",
      icon: <UserRound className="h-5 w-5" />,
      path: "/dashboard",
    },
    {
      title: "Attendance",
      icon: <Fingerprint className="h-5 w-5" />,
      path: "/attendance",
    },
    {
      title: "Salary",
      icon: <Calendar className="h-5 w-5" />,
      path: "/salary",
    },
    {
      title: "Reports",
      icon: <FileSpreadsheet className="h-5 w-5" />,
      path: "/reports",
    },
  ];

  return (
    <div
      className={cn(
        "h-screen bg-sidebar transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && (
          <h1 className="text-sidebar-foreground font-bold text-lg">
            SIST - MarkMe!
          </h1>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {collapsed ? (
            <ArrowRight className="h-5 w-5" />
          ) : (
            <ArrowLeft className="h-5 w-5" />
          )}
        </Button>
      </div>

      <div className="flex-1 py-4 overflow-y-auto">
        <nav className="px-2 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center text-sidebar-foreground hover:bg-sidebar-accent rounded-md",
                location.pathname === item.path
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
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

export default Sidebar;
