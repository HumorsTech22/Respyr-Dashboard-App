"use client"

import React, { useState } from "react";
import { loginService } from "../services/authService";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function LoginForm({
  className,
  ...props
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const res = await loginService(email, password);
    
    sessionStorage.setItem("access_token", res.access_token);
    sessionStorage.setItem("refresh_token", res.refresh_token);

    // Decode the JWT token to get clinic information
    try {
      const tokenPayload = res.access_token.split('.')[1];
      const decodedData = JSON.parse(atob(tokenPayload));
      const clinicInfo = decodedData.data;

      // Store clinic information
      sessionStorage.setItem("clinic", JSON.stringify(clinicInfo));

      toast.success(`Welcome to ${clinicInfo.clinic_name}`, {
        description: "You have logged in successfully",
      });
      router.push("/dashboard");

    } catch (decodeError) {
      console.error("Error decoding token:", decodeError);
      // Fallback if token decoding fails
      toast.success("Welcome!", {
        description: "You have logged in successfully",
      });
      router.push("/dashboard");
    }

  } catch (error) {
    // Handle the error properly - your fetcher already throws formatted errors
    let errorMessage = "An unexpected error occurred.";
    
    if (error.isApiError) {
      errorMessage = error.message || error.data?.error || "Invalid credentials";
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    toast.error(errorMessage);
  } finally {
    setLoading(false);
  }
};

  
return (
  <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
      <h2 className="text-2xl font-bold text-gray-800 text-center">
        Login to your account
      </h2>
      <p className="text-gray-500 text-center mt-2">
        Enter your email and password to continue.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="email" className="text-[#252525] block text-sm font-medium mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="m@example.com"
            value={email}
                autoComplete="false"
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full text-[#252525] p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="password" className="text-[#252525] block text-sm font-medium">
              Password
            </label>
            <Link
              href="/forgotPassword"
              className="text-sm text-[#308BF9] hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            autoComplete="false"
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full text-[#252525] p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 cursor-pointer bg-[#308BF9] text-white py-2 rounded-lg font-semibold border border-transparent hover:bg-white hover:text-black hover:border-[#308BF9] transition disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  </div>
);


}

