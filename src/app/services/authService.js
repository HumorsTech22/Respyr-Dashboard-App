// // services/authService.js

// import { apiFetcher } from "../config/fetcher";
// import { API_ENDPOINTS } from "../config/apiConfig";
// import { jwtDecode } from "jwt-decode";



// // LOGIN API
// export const loginService = async (email, password) => {
//   return apiFetcher(API_ENDPOINTS.AUTH.LOGIN, {
//     method: "POST",
//     body: JSON.stringify({
//       clinic_email: email,
//       password: password,
//     }),
//   });
// };


// // REFRESH TOKEN API
// export const refreshTokenService = async (refresh_token) => {
//   return apiFetcher(API_ENDPOINTS.AUTH.REFRESH_TOKEN, {
//     method: "POST",
//     body: JSON.stringify({
//       refresh_token: refresh_token,
//     }),
//   });
// };



// // Check if token is expired
// export const isTokenExpired = (token) => {
//   if (!token) return true;
  
//   try {
//     const decoded = jwtDecode(token);
//     const currentTime = Date.now() / 1000;
//     return decoded.exp < currentTime;
//   } catch (error) {
//     console.error("Error decoding token:", error);
//     return true;
//   }
// };

// // Get stored refresh token
// export const getRefreshToken = () => {
//   if (typeof window !== 'undefined') {
//     return sessionStorage.getItem("refresh_token");
//   }
//   return null;
// };

// // Refresh token and update storage
// export const refreshAndUpdateToken = async () => {
//   const refreshToken = getRefreshToken();
  
//   if (!refreshToken) {
//     throw new Error("No refresh token available");
//   }

//   try {
//     const response = await refreshTokenService(refreshToken);
    
//     if (response.status === 'success' && response.access_token) {
//       // Store the new access token
//       sessionStorage.setItem("access_token", response.access_token);
      
//       // Update clinic info from new token
//       try {
//         const decodedData = jwtDecode(response.access_token);
//         const clinicInfo = decodedData.data;
//         sessionStorage.setItem("clinic", JSON.stringify(clinicInfo));
//       } catch (decodeError) {
//         console.error("Error decoding new token:", decodeError);
//       }
      
//       return response.access_token;
//     }
//   } catch (error) {
//     console.error("Token refresh failed:", error);
//     // If refresh fails, clear tokens and redirect to login
//     sessionStorage.removeItem("access_token");
//     sessionStorage.removeItem("refresh_token");
//     sessionStorage.removeItem("clinic");
//     throw error;
//   }
// };


// //Subject page table api
// export const subjectTable = async () => {
//   let token = sessionStorage.getItem("access_token");
  
//   // Check if token is expired
//   if (isTokenExpired(token)) {
//     console.log("Token expired, refreshing...");
//     token = await refreshAndUpdateToken();
//   }

//   if (!token) {
//     throw new Error("No authentication token found");
//   }

//   const decoded = jwtDecode(token);
//   const clinicId = decoded?.data?.clinic_id;
  
//   if (!clinicId) {
//     throw new Error("Clinic ID not found in token");
//   }

//   // Call API with valid token
//   return apiFetcher(API_ENDPOINTS.SUBJECTS.TABLE, {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify({
//       clinic_id: clinicId,
//     }),
//   });
// };












// services/authService.js
import { apiFetcher } from "../config/fetcher";
import { API_ENDPOINTS } from "../config/apiConfig";
import { jwtDecode } from "jwt-decode";

// LOGIN API
export const loginService = async (email, password) => {
  return apiFetcher(API_ENDPOINTS.AUTH.LOGIN, {
    method: "POST",
    body: JSON.stringify({
      clinic_email: email,
      password: password,
    }),
  });
};

// REFRESH TOKEN API - Fixed error handling
export const refreshTokenService = async (refresh_token) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "https://humorstech.com"}${API_ENDPOINTS.AUTH.REFRESH_TOKEN}`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh_token: refresh_token,
      }),
    });

    const data = await response.json();

    if (!response.ok || data.status === 'error') {
      const errorMessage = data.error || data.message || 'Token refresh failed';
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      error.isApiError = true;
      throw error;
    }

    return data;
  } catch (error) {
    if (error.isApiError) {
      throw error;
    }
    console.error("Refresh token fetch error:", error);
    throw new Error("Network error during token refresh");
  }
};

// Check if token is expired
export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    // Add 60 second buffer to avoid edge cases
    return decoded.exp < (currentTime - 60);
  } catch (error) {
    console.error("Error decoding token:", error);
    return true;
  }
};

// Get stored refresh token
export const getRefreshToken = () => {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem("refresh_token");
  }
  return null;
};

// Refresh token and update storage - Fixed implementation
export const refreshAndUpdateToken = async () => {
  const refreshToken = getRefreshToken();
  
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  // Check if refresh token itself is expired
  if (isTokenExpired(refreshToken)) {
    console.error("Refresh token is expired");
    // Clear all storage
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem("access_token");
      sessionStorage.removeItem("refresh_token");
      sessionStorage.removeItem("clinic");
    }
    throw new Error("Session expired. Please login again.");
  }

  try {
    const response = await refreshTokenService(refreshToken);
    
    if (response.access_token) {
      // Store the new access token
      sessionStorage.setItem("access_token", response.access_token);
      
      // Store new refresh token if provided (token rotation)
      if (response.refresh_token) {
        sessionStorage.setItem("refresh_token", response.refresh_token);
      }
      
      // Update clinic info from new token
      try {
        const decodedData = jwtDecode(response.access_token);
        const clinicInfo = decodedData.data;
        sessionStorage.setItem("clinic", JSON.stringify(clinicInfo));
      } catch (decodeError) {
        console.error("Error decoding new token:", decodeError);
      }
      
      console.log("Token refreshed successfully");
      return response.access_token;
    } else {
      throw new Error("No access token in refresh response");
    }
  } catch (error) {
    console.error("Token refresh failed:", error);
    
    // If refresh fails, clear all tokens
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem("access_token");
      sessionStorage.removeItem("refresh_token");
      sessionStorage.removeItem("clinic");
    }
    
    throw error;
  }
};

// Subject page table api - Simplified since fetcher now handles refresh
export const subjectTable = async () => {
  let token = sessionStorage.getItem("access_token");
  
  if (!token) {
    throw new Error("No authentication token found");
  }

  const decoded = jwtDecode(token);
  const clinicId = decoded?.data?.clinic_id;
  
  if (!clinicId) {
    throw new Error("Clinic ID not found in token");
  }

  // apiFetcher will handle token refresh automatically
  return apiFetcher(API_ENDPOINTS.SUBJECTS.TABLE, {
    method: "POST",
    body: JSON.stringify({
      clinic_id: clinicId,
    }),
  });
};