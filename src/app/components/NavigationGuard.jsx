"use client"
import { useAuth } from '../context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function NavigationGuard() {
  const { isAuthenticated, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const protectedRoutes = ['/dashboard', '/profile', '/subjectprofile', '/subjects', '/testhistory'];
    const isProtectedRoute = protectedRoutes.some(route => 
      pathname === route || pathname.startsWith(route + '/')
    );

    if (!isAuthenticated() && isProtectedRoute) {
      router.replace('/'); 
    }
  }, [pathname, isAuthenticated, loading, router]);

  return null;
}