
// import { LoginForm } from "./components/login-form";

// export default function Home() {
//   return (
//     <>
//       <LoginForm />
//     </>
//   );
// }










"use client"
import { LoginForm } from "./components/login-form";
import { useAuth } from "./context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated()) {
      router.replace('/dashboard');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (isAuthenticated()) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-lg">Redirecting to dashboard...</div>
      </div>
    );
  }

  return <LoginForm />;
}