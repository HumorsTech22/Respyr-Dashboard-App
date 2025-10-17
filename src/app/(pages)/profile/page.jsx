"use client";

import React, { useEffect, useState } from "react";
import Header from "@/app/components/header";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import Footer from "@/app/components/Footer";

function decodeJwtPayload(token) {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    // Base64URL → Base64
    let base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    // Pad to multiple of 4
    while (base64.length % 4 !== 0) base64 += "=";
    const json = atob(base64);
    return JSON.parse(json);
  } catch (e) {
    console.error("JWT decode error:", e);
    return null;
  }
}

export default function LoginUser() {
  const [clinicInfo, setClinicInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const token = sessionStorage.getItem("access_token");
      if (token) {
        const decoded = decodeJwtPayload(token);
        // adjust path to where you actually store the data inside JWT
        setClinicInfo(decoded?.data ?? null);
      }
    } catch (error) {
      console.error("Failed to decode token:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 flex justify-center items-start mt-20 px-4">
          <div className="w-full max-w-md bg-[#F5F7FA] shadow-lg rounded-2xl p-6">
            {loading ? (
              <>
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
              </>
            ) : (
              <>
                {/* Profile Image */}
                <div className="flex flex-col items-center gap-3">
                  <img
                    src="/profile.jpg"
                    alt="User Profile"
                    className="w-24 h-24 rounded-full border-2 border-gray-300 object-cover"
                    loading="eager"
                  />
                  <h2 className="text-xl font-semibold text-[#252525] text-center">
                    {clinicInfo?.clinic_name || "Clinic Name Not Available"}
                  </h2>
                </div>

                {/* Clinic Info */}
                <div className="mt-6 space-y-4">
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
              </>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  );
}
