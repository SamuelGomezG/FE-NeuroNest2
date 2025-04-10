import type React from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Models } from 'react-native-appwrite';

import { getCurrentUser } from '@/lib/appwriteConfig';
import type { AuthContextType } from '@/types/AuthTypes';

const AuthContext = createContext<AuthContextType>({ user: null, isLoading: true });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Models.Document | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then(res => {
        setUser(res ? res : null);
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const authValue = useMemo(() => ({ user, isLoading }), [user, isLoading]);

  return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
