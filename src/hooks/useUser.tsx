import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UserContextType {
  user: any;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: any } | { user: any }>;
  signup: (data: { name: string; email: string; password: string; mobile: string }) => Promise<{ error: any } | { user: any }>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const login = async (emailOrPhone: string, password: string) => {
    let emailToUse = emailOrPhone;
    // If input is not an email, treat as phone and look up email
    if (!/.+@.+\..+/.test(emailOrPhone)) {
      const { data, error } = await supabase
        .from('user_logins')
        .select('email')
        .eq('phone', emailOrPhone)
        .single();
      if (error || !data?.email) {
        return { error: { message: 'No account found with this phone number.' } };
      }
      emailToUse = data.email;
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email: emailToUse, password });
    if (error) return { error };
    setUser(data.user);
    return { user: data.user };
  };

  const signup = async ({ name, email, password, mobile }: { name: string; email: string; password: string; mobile: string }) => {
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { name, mobile } } });
    if (error) return { error };
    setUser(data.user);
    // Insert user details into user_logins table
    if (data.user) {
      await supabase.from('user_logins').insert([
        {
          id: data.user.id, // uuid from Auth
          name,
          email,
          phone: mobile,
        },
      ]);
    }
    return { user: data.user };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 