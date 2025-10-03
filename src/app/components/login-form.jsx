"use client"
import Link from "next/link";
import React from "react";

export function LoginForm() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Login to your account
        </h2>
        <p className="text-gray-500 text-center mt-2">
          Enter your email and password to continue.
        </p>

        <form className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="m@example.com"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <Link
                href="/resetPassword"
                className="text-sm text-[#308BF9] hover:underline"
              >
                Forgot your password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="button"
            className="w-full mt-2 cursor-pointer bg-[#308BF9] text-white py-2 rounded-lg font-semibold border border-transparent hover:bg-white hover:text-black hover:border-[#308BF9] transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
