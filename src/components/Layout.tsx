
import React from 'react';
import Sidebar from './Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = React.useState(!isMobile);

  React.useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar for desktop, conditionally rendered on mobile */}
      {(sidebarOpen || !isMobile) && (
        <div className={cn("transition-all duration-300", 
          isMobile ? "fixed z-40 h-full" : "relative")}>
          <Sidebar />
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
          <div className="sticky top-0 z-20 w-full p-4 bg-background border-b flex justify-between items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="font-bold text-lg">SIST - MarkMe!</h1>
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

export default Layout;
