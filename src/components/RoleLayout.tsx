
import React, { useState } from 'react';
import RoleSidebar from './RoleSidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Menu, UserRound } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth, UserRole, AppUser } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface RoleLayoutProps {
  children: React.ReactNode;
}

const RoleLayout: React.FC<RoleLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const { role, user } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);

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
  const initials = user?.name ? user.name.charAt(0) : 'U';

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
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setProfileOpen(true)}
              className={`text-${roleColor}`}
            >
              <Avatar className="h-8 w-8">
                {user?.profilePic ? (
                  <AvatarImage src={user.profilePic} alt={user?.name || "User"} />
                ) : (
                  <AvatarFallback className={`bg-${roleColor} text-white`}>
                    {initials}
                  </AvatarFallback>
                )}
              </Avatar>
            </Button>
          </div>
        )}

        <div className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </div>
        
        {/* User Profile Dialog */}
        <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>User Profile</DialogTitle>
              <DialogDescription>
                Your profile details
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex justify-center">
                <Avatar className="h-24 w-24">
                  {user?.profilePic ? (
                    <AvatarImage src={user.profilePic} alt={user?.name || "User"} />
                  ) : (
                    <AvatarFallback className={`text-2xl bg-${roleColor} text-white`}>
                      {initials}
                    </AvatarFallback>
                  )}
                </Avatar>
              </div>
              <div className="space-y-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                  <p className="font-medium">{user?.name || "Not provided"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="font-medium">{user?.email || "Not provided"}</p>
                </div>
                {role === 'staff' && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Staff ID</p>
                    <p className="font-medium">{user?.staffId || "Not provided"}</p>
                  </div>
                )}
                {role === 'student' && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Register Number</p>
                    <p className="font-medium">{user?.studentId || "Not provided"}</p>
                  </div>
                )}
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Role</p>
                  <p className="font-medium capitalize">{user?.role || "Not provided"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Department</p>
                  <p className="font-medium">{user?.department || "Not provided"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Join Date</p>
                  <p className="font-medium">{user?.joinDate || "Not provided"}</p>
                </div>
                {/* Display IP address for tracking */}
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Device Info</p>
                  <p className="font-medium text-xs">Logged in on this device</p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default RoleLayout;
