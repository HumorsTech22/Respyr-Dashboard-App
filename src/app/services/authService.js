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


// REFRESH TOKEN API
export const refreshTokenService = async (refresh_token) => {
  return apiFetcher(API_ENDPOINTS.AUTH.REFRESH_TOKEN, {
    method: "POST",
    body: JSON.stringify({
      refresh_token: refresh_token,
    }),
  });
};



// Check if token is expired
export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
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

// Refresh token and update storage
export const refreshAndUpdateToken = async () => {
  const refreshToken = getRefreshToken();
  
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  try {
    const response = await refreshTokenService(refreshToken);
    
    if (response.status === 'success' && response.access_token) {
      // Store the new access token
      sessionStorage.setItem("access_token", response.access_token);
      
      // Update clinic info from new token
      try {
        const decodedData = jwtDecode(response.access_token);
        const clinicInfo = decodedData.data;
        sessionStorage.setItem("clinic", JSON.stringify(clinicInfo));
      } catch (decodeError) {
        console.error("Error decoding new token:", decodeError);
      }
      
      return response.access_token;
    }
  } catch (error) {
    console.error("Token refresh failed:", error);
    // If refresh fails, clear tokens and redirect to login
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("refresh_token");
    sessionStorage.removeItem("clinic");
    throw error;
  }
};


//Subject page table api
// export const subjectTable = async () => {
//   const token = sessionStorage.getItem("access_token");
//   if (!token) {
//     throw new Error("No authentication token found");
//   }

//   const decoded = jwtDecode(token);

//   const clinicId = decoded?.data?.clinic_id;
//   if (!clinicId) {
//     throw new Error("Clinic ID not found in token");
//   }

//   // Call API
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




export const subjectTable = async () => {
  let token = sessionStorage.getItem("access_token");
  
  // Check if token is expired
  if (isTokenExpired(token)) {
    console.log("Token expired, refreshing...");
    token = await refreshAndUpdateToken();
  }

  if (!token) {
    throw new Error("No authentication token found");
  }

  const decoded = jwtDecode(token);
  const clinicId = decoded?.data?.clinic_id;
  
  if (!clinicId) {
    throw new Error("Clinic ID not found in token");
  }

  // Call API with valid token
  return apiFetcher(API_ENDPOINTS.SUBJECTS.TABLE, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      clinic_id: clinicId,
    }),
  });
};