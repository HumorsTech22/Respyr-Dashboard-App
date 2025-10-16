"use client"
import { createContext, useContext, useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = () => {
      try {
        const accessToken = sessionStorage.getItem('access_token');
        const clinicInfo = sessionStorage.getItem('clinic');
        
        if (accessToken) {
          const userState = { 
            authenticated: true,
            clinic: clinicInfo ? JSON.parse(clinicInfo) : null
          };
          setUser(userState);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        sessionStorage.clear();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (accessToken, refreshToken, clinicInfo = null) => {
    sessionStorage.setItem('access_token', accessToken);
    sessionStorage.setItem('refresh_token', refreshToken);
    
    if (clinicInfo) {
      sessionStorage.setItem('clinic', JSON.stringify(clinicInfo));
    }
    
    setUser({ 
      authenticated: true,
      clinic: clinicInfo
    });
    
    router.replace('/dashboard');
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
    sessionStorage.removeItem('clinic');
    router.replace('/'); // Redirect to home instead of /login
  };

  const isAuthenticated = () => {
    return !!sessionStorage.getItem('access_token');
  };

  const getAccessToken = () => {
    return sessionStorage.getItem('access_token');
  };

  const getRefreshToken = () => {
    return sessionStorage.getItem('refresh_token');
  };

  const getClinicInfo = () => {
    try {
      const clinic = sessionStorage.getItem('clinic');
      return clinic ? JSON.parse(clinic) : null;
    } catch {
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      loading, 
      isAuthenticated,
      getAccessToken,
      getRefreshToken,
      getClinicInfo
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};