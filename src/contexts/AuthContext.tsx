import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'admin' | 'staff' | 'student' | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  joinDate?: string;
  profilePic?: string;
  studentId?: string;
  staffId?: string;
}

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (userData: Partial<User>) => void;
  deviceId: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Generate a unique device ID
const generateDeviceId = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [deviceId] = useState<string>(() => {
    const storedDeviceId = localStorage.getItem('deviceId');
    if (storedDeviceId) return storedDeviceId;
    
    const newDeviceId = generateDeviceId();
    localStorage.setItem('deviceId', newDeviceId);
    return newDeviceId;
  });

  useEffect(() => {
    // Check localStorage for existing user data and verify device ID
    const storedUser = localStorage.getItem('geoAttendanceUser');
    const storedDeviceId = localStorage.getItem('lastLoginDevice');
    
    if (storedUser && storedDeviceId) {
      // If logged in from a different device, don't restore the session
      if (storedDeviceId !== deviceId) {
        logout();
        return;
      }
      
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setRole(userData.role);
      setIsAuthenticated(true);
    }
  }, [deviceId]);

  // Demo user data for different roles
  const demoUsers = {
    admin: {
      id: "1",
      name: "Admin User",
      email: "admin@example.com",
      role: "admin" as UserRole,
      department: "Administration",
      joinDate: "2022-01-01",
    },
    staff: {
      id: "2",
      name: "Staff User",
      email: "staff@example.com",
      role: "staff" as UserRole,
      department: "Computer Science",
      joinDate: "2022-05-15",
      staffId: "STAFF001",
    },
    student: {
      id: "3",
      name: "Student User",
      email: "student@example.com",
      role: "student" as UserRole,
      department: "Computer Science",
      joinDate: "2023-08-01",
      studentId: "CS2023001",
    }
  };

  const login = async (email: string, password: string, userRole: UserRole): Promise<boolean> => {
    if (!email || !password || !userRole) return false;

    const roleUser = demoUsers[userRole as keyof typeof demoUsers];

    if (roleUser) {
      // Store the current device ID as the last login device
      localStorage.setItem('lastLoginDevice', deviceId);
      
      setUser(roleUser);
      setRole(userRole);
      setIsAuthenticated(true);
      localStorage.setItem('geoAttendanceUser', JSON.stringify(roleUser));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    setIsAuthenticated(false);
    localStorage.removeItem('geoAttendanceUser');
    localStorage.removeItem('lastLoginDevice');
  };

  const updateUserProfile = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('geoAttendanceUser', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      role, 
      isAuthenticated, 
      login, 
      logout, 
      updateUserProfile,
      deviceId 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
