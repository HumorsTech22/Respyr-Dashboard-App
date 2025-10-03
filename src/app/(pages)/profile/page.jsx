import React from 'react'

export default function LoginUser () {
  return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6">
        {/* Profile Image */}
        <div className="flex flex-col items-center gap-3">
          <img
            src="/profile.jpg"
            alt="User Profile"
            className="w-24 h-24 rounded-full border-2 border-gray-300 object-cover"
          />
          <h2 className="text-xl font-semibold text-gray-800">User Name</h2>
        </div>

        {/* Form Fields */}
        <div className="mt-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Registered Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Registered Phone No
            </label>
            <input
              type="tel"
              placeholder="Enter your phone number"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Report Logo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Report Logo
            </label>
            <input
              type="file"
              className="mt-1 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0 file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex flex-col gap-3">
          <button className="w-full py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700">
            Change Password
          </button>
          <button className="w-full py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600">
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}


