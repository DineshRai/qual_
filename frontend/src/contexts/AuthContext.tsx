'use client';

import React, { createContext, useContext } from 'react';
import { useSession } from 'next-auth/react';

interface AuthContextType {
  user: any | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session, status } = useSession();

  return (
    <AuthContext.Provider value={{ user: session?.user || null, loading: status === 'loading' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);