
import React from 'react';
import RoleSidebar from './RoleSidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth, UserRole } from '@/contexts/AuthContext';

interface RoleLayoutProps {
  children: React.ReactNode;
}

const RoleLayout: React.FC<RoleLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = React.useState(!isMobile);
  const { role } = useAuth();

  React.useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  // Role-specific header text
  const getHeaderText = () => {
    switch (role) {
      case 'admin':
        return 'Admin Portal';
      case 'staff':
        return 'Staff Portal';
      case 'student':
        return 'Student Portal';
      default:
        return 'SIST - MarkMe!';
    }
  };

  // Role-specific colors
  const getRoleColor = (role: UserRole) => {
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

  const headerText = getHeaderText();
  const roleColor = getRoleColor(role);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar for desktop, conditionally rendered on mobile */}
      {(sidebarOpen || !isMobile) && (
        <div className={cn("transition-all duration-300", 
          isMobile ? "fixed z-40 h-full" : "relative")}>
          <RoleSidebar role={role} />
        </div>
      )}

      {/* Overlay for mobile when sidebar is open */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="flex-1 flex flex-col min-h-screen">
        {/* Mobile header with menu button */}
        {isMobile && (
          <div className={`sticky top-0 z-20 w-full p-4 bg-background border-b flex justify-between items-center`}>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`text-${roleColor}`}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className={`font-bold text-lg text-${roleColor}`}>{headerText}</h1>
            <div className="w-9"></div> {/* Spacer for alignment */}
          </div>
        )}

        <div className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default RoleLayout;
