"use client"

import React, { useState } from "react";

import { loginService } from "../services/authService";

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
          <label htmlFor="email" className="block text-sm font-medium mb-2">
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
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
           
          </div>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            autoComplete="false"
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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












// "use client"

// import React, { useState } from "react";
// import { useRouter } from "next/navigation";

// export function LoginForm({
//   className,
//   ...props
// }) {
//   const router = useRouter();
//   const [email, setEmail] = useState("");
//   console.log("email136:-", email);
//   const [password, setPassword] = useState("");
//   console.log("password138:-", password);
//   const [loading, setLoading] = useState(false);

//   // Login service function
// const loginService = async (clinic_email, password) => {
//   const response = await fetch("https://humorstech.com/clinicalapp/api/login.php", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       // Optional CORS-related headers
//       "Accept": "application/json",
//       "Access-Control-Allow-Origin": "*", // Browser ignores this, but harmless
//       "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
//       "Access-Control-Allow-Headers": "Content-Type, Authorization",
//     },
//     body: JSON.stringify({
//       clinic_email: clinic_email,
//       password: password,
//     }),
//     mode: "cors", // explicitly tell fetch you expect a CORS request
//     credentials: "omit", // or "include" if you need cookies
//   });

//   const data = await response.json();
//   console.log("data153:-", data);

//   if (!response.ok) {
//     const error = new Error(data.message || "Login failed");
//     error.status = response.status;
//     error.data = data;
//     throw error;
//   }

//   if (data.status !== "success") {
//     const error = new Error(data.message || "Login failed");
//     error.data = data;
//     throw error;
//   }

//   return data;
// };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const res = await loginService(email, password);
     
//       // Store tokens in sessionStorage
//       sessionStorage.setItem("access_token", res.access_token);
//       sessionStorage.setItem("refresh_token", res.refresh_token);

//       // Show success message (you'll need to implement toast)
//       // toast.success(`Login successful`, {
//       //   description: "You have logged in successfully",
//       // });
      
//       console.log("Login successful:", res);
      
//       // Redirect to dashboard
//       router.push("/dashboard");

//     } catch (error) {
//       // Handle the error properly
//       let errorMessage = "An unexpected error occurred.";
      
//       // Check different error types
//       if (error.data?.message) {
//         errorMessage = error.data.message;
//       } else if (error.message) {
//         errorMessage = error.message;
//       }
      
//       // Show error message (you'll need to implement toast)
//       // toast.error(errorMessage);
//       console.error("Login error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
//         <h2 className="text-2xl font-bold text-gray-800 text-center">
//           Login to your account
//         </h2>
//         <p className="text-gray-500 text-center mt-2">
//           Enter your email and password to continue.
//         </p>

//         <form onSubmit={handleSubmit} className="mt-6 space-y-4">
//           <div>
//             <label htmlFor="email" className="block text-sm font-medium mb-2">
//               Email
//             </label>
//             <input
//               id="email"
//               type="email"
//               placeholder="m@example.com"
//               value={email}
//               autoComplete="false"
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <div>
//             <div className="flex items-center justify-between mb-2">
//               <label htmlFor="password" className="block text-sm font-medium">
//                 Password
//               </label>
//             </div>
//             <input
//               id="password"
//               type="password"
//               placeholder="Enter your password"
//               value={password}
//               autoComplete="false"
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full mt-2 cursor-pointer bg-[#308BF9] text-white py-2 rounded-lg font-semibold border border-transparent hover:bg-white hover:text-black hover:border-[#308BF9] transition disabled:opacity-60"
//           >
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }