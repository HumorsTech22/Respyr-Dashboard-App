// "use client";

// import { useState, useRef } from "react";
// import Link from "next/link";

// export default function ForgotPassword() {
//   const [step, setStep] = useState("reset"); 
//   const [email, setEmail] = useState("");
//   const [otp, setOtp] = useState(["", "", "", ""]);
//   const inputRefs = useRef([]);

//   const handleResetSubmit = (e) => {
//     e.preventDefault();
//     setStep("otp");
//   };

//   const handleOtpSubmit = (e) => {
//     e.preventDefault();
//     const enteredOtp = otp.join("");
//     console.log("OTP entered:", enteredOtp);
//     setStep("forgot");
//   };

//   const handleOtpChange = (value, index) => {
//     // Only allow numbers
//     if (/^[0-9]?$/.test(value)) {
//       const newOtp = [...otp];
//       newOtp[index] = value;
//       setOtp(newOtp);

//       // Auto-focus next input if value is entered
//       if (value && index < otp.length - 1) {
//         inputRefs.current[index + 1].focus();
//       }
//     }
//   };

//   const handleKeyDown = (e, index) => {
//     // Handle backspace - focus previous input when backspace is pressed on empty field
//     if (e.key === "Backspace" && !otp[index] && index > 0) {
//       inputRefs.current[index - 1].focus();
//     }
//   };

//   const handlePaste = (e) => {
//     e.preventDefault();
//     const pasteData = e.clipboardData.getData("text").trim();
    
//     if (/^[0-9]+$/.test(pasteData)) {
//       const digits = pasteData.split("").slice(0, otp.length);
//       const newOtp = [...otp];
      
//       digits.forEach((digit, i) => {
//         newOtp[i] = digit;
//         if (inputRefs.current[i]) {
//           inputRefs.current[i].value = digit;
//         }
//       });
      
//       setOtp(newOtp);
      
//       // Focus the last input that got a value
//       const lastIndex = Math.min(digits.length - 1, otp.length - 1);
//       if (inputRefs.current[lastIndex]) {
//         inputRefs.current[lastIndex].focus();
//       }
//     }
//   };

//   const handlePasswordReset = (e) => {
//     e.preventDefault();
//     console.log("Password reset for:", email);
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
//         {step === "reset" && (
//           <>
//             <div className="">
//               <h2 className="text-2xl font-bold text-[#252525] text-center">
//                 Forgot Password
//               </h2>
//               <p className="text-[#535359] text-center mt-2">
//                 Enter your Clinic Name
//               </p> 
//             </div>

//             <form onSubmit={handleResetSubmit} className="mt-6">
//               <div>
//                 <input
//                   id="clinicName"
//                   type="text" /* Changed from email to text */
//                   placeholder="Enter your clinic name" /* Updated placeholder */
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                   className="w-full text-[#252525] p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               <button
//                 type="submit"
//                 className="w-full mt-4 cursor-pointer bg-[#308BF9] text-white py-2 rounded-lg border border-transparent hover:bg-white hover:text-[#252525] hover:border-[#308BF9] transition"
//               >
//                 Send OTP
//               </button>
//             </form>
            
//             <div className="flex justify-center mt-4">
//               <Link
//                 href="/"
//                 className="text-sm font-medium text-[#535359] hover:text-[#252525]"
//                 prefetch={false}
//               >
//                 Back to login
//               </Link>
//             </div>
//           </>
//         )}

//         {step === "otp" && (
//           <>
//             <h2 className="text-2xl font-bold text-gray-800 text-center">
//               Enter OTP
//             </h2>
//             <p className="text-gray-500 text-center mt-2">
//               We sent a 4-digit OTP to your email.
//             </p>

//             <form onSubmit={handleOtpSubmit} className="mt-6 space-y-6">
//               <div 
//                 className="flex justify-center gap-4" 
//                 onPaste={handlePaste}
//               >
//                 {otp.map((digit, index) => (
//                   <input
//                     key={index}
//                     type="text"
//                     inputMode="numeric"
//                     pattern="[0-9]*"
//                     value={digit}
//                     onChange={(e) => handleOtpChange(e.target.value, index)}
//                     onKeyDown={(e) => handleKeyDown(e, index)}
//                     ref={(el) => (inputRefs.current[index] = el)}
//                     className="w-12 h-12 border border-black rounded-lg text-center text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     maxLength="1"
//                   />
//                 ))}
//               </div>

//               <button
//                 type="submit"
//                 className="w-full mt-4 cursor-pointer bg-[#308BF9] text-white py-2 rounded-lg font-semibold border border-transparent hover:bg-white hover:text-black hover:border-[#308BF9] transition"
//               >
//                 Verify OTP
//               </button>
//             </form>

//             <p className="text-sm text-gray-500 text-center mt-4">
//               Didn't receive OTP?{" "}
//               <button
//                 type="button"
//                 className="cursor-pointer text-[#308BF9] hover:underline"
//                 onClick={() => {
//                   console.log("Resend OTP to:", email);
//                 }}
//               >
//                 Resend
//               </button>
//             </p>

//             <div className="flex justify-center mt-4">
//               <Link
//                 href="/"
//                 className="text-sm font-medium text-gray-600 hover:text-gray-900"
//                 prefetch={false}
//               >
//                 Back to login
//               </Link>
//             </div>
//           </>
//         )}

//         {step === "forgot" && (
//           <div className="space-y-6">
//             <h2 className="text-2xl font-bold text-gray-800 text-center">
//               Reset your password
//             </h2>
//             <p className="text-gray-500 text-center">
//               Enter your new password
//             </p>

//             <form onSubmit={handlePasswordReset} className="space-y-4">
//               <div>
//                 <label htmlFor="password" className="block text-sm font-medium mb-2">
//                   New Password
//                 </label>
//                 <input
//                   id="password"
//                   name="password"
//                   type="password"
//                   required
//                   placeholder="Enter new password"
//                   className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               <div>
//                 <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
//                   Confirm Password
//                 </label>
//                 <input
//                   id="confirmPassword"
//                   name="confirmPassword"
//                   type="password"
//                   required
//                   placeholder="Confirm your password"
//                   className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               <button 
//                 type="submit" 
//                 className="w-full cursor-pointer bg-[#308BF9] text-white py-2 rounded-lg border border-transparent hover:bg-white hover:text-black hover:border-[#308BF9] transition"
//               >
//                 Reset password
//               </button>
//             </form>

//             <div className="flex justify-center">
//               <Link
//                 href="/"
//                 className="text-sm font-medium text-gray-600 hover:text-gray-900"
//                 prefetch={false}
//               >
//                 Back to login
//               </Link>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }









"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { sendOtpService, updatePasswordService } from "../services/authService";

export default function ForgotPassword() {
  const [step, setStep] = useState("reset"); 
  const [email, setEmail] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [storedOtp, setStoredOtp] = useState("");
  const [clinicId, setClinicId] = useState("");
  const inputRefs = useRef([]);

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await sendOtpService(clinicName, clinicName, email);
      
      if (response.success) {
        setSuccess("OTP sent successfully to your email!");
        setStep("otp");
        setStoredOtp(response.otp);
        setClinicId(response.clinic_id);
        console.log("OTP sent:", response.otp);
      } else {
        setError(response.message || "Failed to send OTP");
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    
    if (enteredOtp.length !== 4) {
      setError("Please enter a valid 4-digit OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (enteredOtp === storedOtp) {
        setSuccess("OTP verified successfully!");
        setStep("forgot");
      } else {
        setError("Invalid OTP. Please try again.");
        setOtp(["", "", "", ""]);
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
      }
    } catch (err) {
      setError("Failed to verify OTP. Please try again.");
      setOtp(["", "", "", ""]);
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await sendOtpService(clinicName, clinicName, email);
      
      if (response.success) {
        setSuccess("OTP resent successfully!");
        setStoredOtp(response.otp);
        setClinicId(response.clinic_id);
        setOtp(["", "", "", ""]);
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
        console.log("New OTP sent:", response.otp);
      } else {
        setError(response.message || "Failed to resend OTP");
      }
    } catch (err) {
      setError(err.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < otp.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim();
    
    if (/^[0-9]+$/.test(pasteData)) {
      const digits = pasteData.split("").slice(0, otp.length);
      const newOtp = [...otp];
      
      digits.forEach((digit, i) => {
        newOtp[i] = digit;
        if (inputRefs.current[i]) {
          inputRefs.current[i].value = digit;
        }
      });
      
      setOtp(newOtp);
      
      const lastIndex = Math.min(digits.length - 1, otp.length - 1);
      if (inputRefs.current[lastIndex]) {
        inputRefs.current[lastIndex].focus();
      }
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    // Basic validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Call the update password service
      const response = await updatePasswordService(clinicId, password);
      
      if (response.success) {
        setSuccess("Password reset successfully!");
        
        // Redirect to login page after successful reset
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      } else {
        setError(response.message || "Failed to reset password");
      }
    } catch (err) {
      setError(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        {/* Error and Success Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
            {success}
          </div>
        )}

        {step === "reset" && (
          <>
            <div className="">
              <h2 className="text-2xl font-bold text-[#252525] text-center">
                Forgot Password
              </h2>
              <p className="text-[#535359] text-center mt-2">
                Enter your Clinic Name and Email
              </p> 
            </div>

            <form onSubmit={handleResetSubmit} className="mt-6 space-y-4">
              <div>
                <input
                  id="clinicName"
                  type="text"
                  placeholder="Enter your clinic name"
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                  required
                  className="w-full text-[#252525] p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
               
              {/* <div>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full text-[#252525] p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div> */}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 cursor-pointer bg-[#308BF9] text-white py-2 rounded-lg border border-transparent hover:bg-white hover:text-[#252525] hover:border-[#308BF9] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
            
            <div className="flex justify-center mt-4">
              <Link
                href="/"
                className="text-sm font-medium text-[#535359] hover:text-[#252525]"
                prefetch={false}
              >
                Back to login
              </Link>
            </div>
          </>
        )}

        {step === "otp" && (
          <>
            <h2 className="text-2xl font-bold text-gray-800 text-center">
              Enter OTP
            </h2>
            <p className="text-gray-500 text-center mt-2">
              We sent a 4-digit OTP to your email.
            </p>

            <form onSubmit={handleOtpSubmit} className="mt-6 space-y-6">
              <div 
                className="flex justify-center gap-4" 
                onPaste={handlePaste}
              >
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    ref={(el) => (inputRefs.current[index] = el)}
                    className="w-12 h-12 border border-black rounded-lg text-center text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    maxLength="1"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={loading || otp.join("").length !== 4}
                className="w-full mt-4 cursor-pointer bg-[#308BF9] text-white py-2 rounded-lg font-semibold border border-transparent hover:bg-white hover:text-black hover:border-[#308BF9] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>

            <p className="text-sm text-gray-500 text-center mt-4">
              Didn't receive OTP?{" "}
              <button
                type="button"
                className="cursor-pointer text-[#308BF9] hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleResendOtp}
                disabled={loading}
              >
                {loading ? "Resending..." : "Resend"}
              </button>
            </p>

            <div className="flex justify-center mt-4">
              <Link
                href="/"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
                prefetch={false}
              >
                Back to login
              </Link>
            </div>
          </>
        )}

        {step === "forgot" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 text-center">
              Reset your password
            </h2>
            <p className="text-gray-500 text-center">
              Enter your new password
            </p>

            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  New Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="Enter new password"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  minLength="6"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  placeholder="Confirm your password"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  minLength="6"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full cursor-pointer bg-[#308BF9] text-white py-2 rounded-lg border border-transparent hover:bg-white hover:text-black hover:border-[#308BF9] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Resetting..." : "Reset password"}
              </button>
            </form>

            <div className="flex justify-center">
              <Link
                href="/"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
                prefetch={false}
              >
                Back to login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}