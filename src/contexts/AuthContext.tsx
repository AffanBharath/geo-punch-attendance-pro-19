
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
}

interface AuthContextType {
  user: AppUser | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
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
              profilePic: profile.profile_pic
            });
            setRole(profile.role as UserRole);
            setIsAuthenticated(true);
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
              });
              setRole((metadata.role as UserRole) || 'student');
              setIsAuthenticated(true);
            }
          }
        } else {
          setUser(null);
          setRole(null);
          setIsAuthenticated(false);
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
                profilePic: profile.profile_pic
              });
              setRole(profile.role as UserRole);
              setIsAuthenticated(true);
            }
          });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    try {
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
      await supabase.auth.signOut();
      setUser(null);
      setRole(null);
      setIsAuthenticated(false);
      setSession(null);
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
