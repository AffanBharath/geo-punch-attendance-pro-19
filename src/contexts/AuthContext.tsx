import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

export type UserRole = 'admin' | 'staff' | 'student' | null;

export interface AppUser {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
  department?: string | null;
  joinDate?: string | null;
  profilePic?: string | null;
  studentId?: string | null;
  staffId?: string | null;
  lastLoginIp?: string | null;
  lastLoginTime?: string | null;
}

interface AuthContextType {
  user: AppUser | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (identifier: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUserProfile: (userData: Partial<AppUser>) => Promise<void>;
  session: Session | null;
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

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [ipAddress, setIpAddress] = useState<string | null>(null);

  // Get client IP for fraud prevention
  useEffect(() => {
    const getClientIP = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        setIpAddress(data.ip);
      } catch (error) {
        console.error('Error fetching IP', error);
      }
    };
    
    getClientIP();
  }, []);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        if (session?.user) {
          // Try to get profile from database
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          // If the profile exists in database, use it
          if (profile) {
            setUser({
              id: session.user.id,
              name: profile.name,
              email: session.user.email!,
              role: profile.role as UserRole,
              department: profile.department,
              joinDate: profile.join_date,
              studentId: profile.student_id,
              staffId: profile.staff_id,
              profilePic: profile.profile_pic,
              lastLoginIp: ipAddress || undefined,
              lastLoginTime: new Date().toISOString()
            });
            setRole(profile.role as UserRole);
            setIsAuthenticated(true);
            
            // Record last login in localStorage for tracking
            if (ipAddress) {
              localStorage.setItem('lastLoginIP', ipAddress);
              localStorage.setItem('lastLoginTime', new Date().toISOString());
              localStorage.setItem('currentUserID', session.user.id);
              
              // Update profile with login info if needed
              await supabase
                .from('profiles')
                .update({
                  last_login_ip: ipAddress,
                  last_login_time: new Date().toISOString()
                })
                .eq('id', session.user.id);
            }
          } 
          // If profile doesn't exist but we have user metadata, create the profile
          else if (session.user.user_metadata) {
            const metadata = session.user.user_metadata;
            
            // Create a new profile
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: session.user.id,
                name: metadata.name,
                email: session.user.email,
                role: metadata.role || 'student',
                department: metadata.department,
                student_id: metadata.student_id,
                staff_id: metadata.staff_id,
                last_login_ip: ipAddress,
                last_login_time: new Date().toISOString()
              });

            if (!insertError) {
              setUser({
                id: session.user.id,
                name: metadata.name,
                email: session.user.email!,
                role: (metadata.role as UserRole) || 'student',
                department: metadata.department,
                studentId: metadata.student_id,
                staffId: metadata.staff_id,
                lastLoginIp: ipAddress || undefined,
                lastLoginTime: new Date().toISOString()
              });
              setRole((metadata.role as UserRole) || 'student');
              setIsAuthenticated(true);
              
              // Record login in localStorage for tracking
              if (ipAddress) {
                localStorage.setItem('lastLoginIP', ipAddress);
                localStorage.setItem('lastLoginTime', new Date().toISOString());
                localStorage.setItem('currentUserID', session.user.id);
              }
            }
          }
        } else {
          setUser(null);
          setRole(null);
          setIsAuthenticated(false);
          // Clear login tracking data
          localStorage.removeItem('lastLoginIP');
          localStorage.removeItem('lastLoginTime');
          localStorage.removeItem('currentUserID');
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setSession(session);
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profile }) => {
            if (profile) {
              setUser({
                id: session.user.id,
                name: profile.name,
                email: session.user.email!,
                role: profile.role as UserRole,
                department: profile.department,
                joinDate: profile.join_date,
                studentId: profile.student_id,
                staffId: profile.staff_id,
                profilePic: profile.profile_pic,
                lastLoginIp: profile.last_login_ip || ipAddress,
                lastLoginTime: profile.last_login_time || new Date().toISOString()
              });
              setRole(profile.role as UserRole);
              setIsAuthenticated(true);
              
              // Record login in localStorage for tracking
              if (ipAddress) {
                localStorage.setItem('currentUserID', session.user.id);
              }
            }
          });
      }
    });

    return () => subscription.unsubscribe();
  }, [ipAddress]);

  const login = async (identifier: string, password: string, role: UserRole): Promise<boolean> => {
    try {
      // If identifier doesn't look like an email, convert it to the email format
      let email = identifier;
      if (!email.includes('@')) {
        email = `${identifier}@sist.edu`;
      }

      // Check for multiple logins on the same device
      const currentLoginIP = ipAddress;
      const previousLoginIP = localStorage.getItem('lastLoginIP');
      const currentUserID = localStorage.getItem('currentUserID');
      
      if (previousLoginIP && currentUserID && previousLoginIP === currentLoginIP && 
          localStorage.getItem('isActiveSession') === 'true') {
        console.log('Warning: Attempting to login with different credentials from same device');
        // In a real system, you might want to enforce additional security here
      }

      const { data: { user: authUser }, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      if (authUser) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (profile?.role !== role) {
          await logout();
          return false;
        }
        
        // Mark session as active
        localStorage.setItem('isActiveSession', 'true');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      // Mark session as inactive
      localStorage.setItem('isActiveSession', 'false');
      await supabase.auth.signOut();
      setUser(null);
      setRole(null);
      setIsAuthenticated(false);
      setSession(null);
      // Clear login tracking data
      localStorage.removeItem('currentUserID');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateUserProfile = async (userData: Partial<AppUser>) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: userData.name,
          department: userData.department,
          student_id: userData.studentId,
          staff_id: userData.staffId,
          profile_pic: userData.profilePic,
          role: userData.role
        })
        .eq('id', user.id);

      if (error) throw error;

      setUser(prev => prev ? { ...prev, ...userData } : null);
    } catch (error) {
      console.error('Update profile error:', error);
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
      session 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
