"use client";
import React, { useEffect, useState } from "react";
import Header from "@/app/components/header";

export default function LoginUser() {
  const [clinicInfo, setClinicInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getClinicInfo = () => {
      try {
        // Get the token from session storage
        const token = sessionStorage.getItem("access_token");
        if (token) {
          // Decode JWT payload - more robust decoding
          const payload = token.split(".")[1];
          if (payload) {
            // Use proper base64 decoding for JWT
            const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
            const decoded = JSON.parse(atob(base64));
            setClinicInfo(decoded.data);
          }
        }
      } catch (error) {
        console.error("Failed to decode token:", error);
      } finally {
        setLoading(false);
      }
    };

    // Use requestAnimationFrame for better performance
    const timer = setTimeout(() => {
      getClinicInfo();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Show loading state
  if (loading) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center mt-20">
          <div className="w-full max-w-md bg-[#F5F7FA] shadow-lg rounded-2xl p-6">
            <div className="flex flex-col items-center gap-3">
              <div className="w-24 h-24 rounded-full border-2 border-gray-300 bg-gray-200 animate-pulse"></div>
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="mt-6 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i}>
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="flex justify-center items-center mt-20">
        <div className="w-full max-w-md bg-[#F5F7FA] shadow-lg rounded-2xl p-6">
          {/* Profile Image */}
          <div className="flex flex-col items-center gap-3">
            <img
              src="/profile.jpg"
              alt="User Profile"
              className="w-24 h-24 rounded-full border-2 border-gray-300 object-cover"
              loading="eager" // Force eager loading for profile image
            />
            <h2 className="text-xl font-semibold text-[#252525]">
              {clinicInfo?.clinic_name || "Clinic Name Not Available"}
            </h2>
          </div>

          {/* Clinic Info */}
          <div className="mt-6 space-y-4">
            {/* Clinic Name */}
            <div>
              <label className="block text-sm font-medium text-[#5B5B5B]">
                Clinic Name
              </label>
              <input
                type="text"
                value={clinicInfo?.clinic_name || "Not available"}
                readOnly
                className="focus:outline-none focus:ring-0 mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-[#252525]"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#5B5B5B]">
                Registered Email
              </label>
              <input
                type="email"
                value={clinicInfo?.clinic_email || "Not available"}
                readOnly
                className="bg-white focus:outline-none focus:ring-0 mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-[#252525]"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-[#5B5B5B]">
                Location
              </label>
              <input
                type="text"
                value={clinicInfo?.location || "Not available"}
                readOnly
                className="bg-white focus:outline-none focus:ring-0 mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-[#252525]"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex flex-col gap-3">
            <button className="w-full py-2 cursor-pointer rounded-lg bg-[#308BF9] text-white font-medium hover:bg-blue-700 transition-colors">
              Change Password
            </button>
          </div>
        </div>
      </div>
    </>
  );
}