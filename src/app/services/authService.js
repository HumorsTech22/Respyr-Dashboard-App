

// services/authService.js
import { apiFetcher } from "../config/fetcher";
import { API_ENDPOINTS } from "../config/apiConfig";
import { jwtDecode } from "jwt-decode";
import { API_BASE_URL } from "../config/apiConfig";

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

// REFRESH TOKEN API - Use direct fetch to avoid circular dependency
// REFRESH TOKEN API - Fixed error handling
export const refreshTokenService = async (refresh_token) => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH.REFRESH_TOKEN}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token }),
    });

    const data = await response.json();

    if (!response.ok || data.status === "error") {
      const errorMessage = data.error || data.message || "Token refresh failed";
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      error.isApiError = true;
      throw error;
    }

    return data;
  } catch (error) {
    if (error.isApiError) throw error;
    console.error("Refresh token fetch error:", error);
    throw new Error("Network error during token refresh");
  }
};

// Check if token is expired (with 60s buffer)
export const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    // Treat token as expired if it will expire within the next 60s
    return decoded.exp <= currentTime + 60;
  } catch (error) {
    console.error("Error decoding token:", error);
    return true;
  }
};

// Get stored refresh token
export const getRefreshToken = () => {
  if (typeof window !== "undefined") {
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

  // DO NOT try to decode opaque refresh tokens; just attempt refresh.
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
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("access_token");
      sessionStorage.removeItem("refresh_token");
      sessionStorage.removeItem("clinic");
    }

    throw error;
  }
};


// SEND OTP API - Using apiFetcher for consistent error handling
export const sendOtpService = async (clinicIdentifier, clinicName, clinicEmail) => {
  return apiFetcher(API_ENDPOINTS.AUTH.SEND_OTP, {
    method: "POST",
    body: JSON.stringify({
      clinic_identifier: clinicIdentifier,
      clinic_name: clinicName,
      clinic_email: clinicEmail,
    }),
  });
};

// UPDATE PASSWORD API
export const updatePasswordService = async (clinicId, newPassword) => {
  return apiFetcher(API_ENDPOINTS.AUTH.UPDATED_PASSWORD, {
    method: "POST",
    body: JSON.stringify({
      clinic_id: clinicId,
      new_password: newPassword,
    }),
  });
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

// TEST HISTORY
export const testHistory = async () => {
  let token = sessionStorage.getItem("access_token");
  if (!token) {
    throw new Error("No authentication token found");
  }

  const decoded = jwtDecode(token);
  const clinicId = decoded?.data?.clinic_id;

  if (!clinicId) {
    throw new Error("Clinic ID not found in token");
  }

  return apiFetcher(API_ENDPOINTS.TEST.HISTORY, {
    method: "POST",
    body: JSON.stringify({
      clinic_id: clinicId,
    }),
  });
};



const formatApiDate = (dateObj) => {
  // guard & normalize to local date (no time)
  const d = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
};



export const fetchDatewiseData = async (dateObj = new Date()) => {
  const token = sessionStorage.getItem("access_token");
  if (!token) throw new Error("No authentication token found");

  const decoded = jwtDecode(token);
  const clinicId = decoded?.data?.clinic_id;
  if (!clinicId) throw new Error("Clinic ID not found in token");

  const dateStr = formatApiDate(dateObj);

  return apiFetcher(API_ENDPOINTS.CALENDER.DATEWISE, {
    method: "POST",
    body: JSON.stringify({
      clinic_id: clinicId,
      date: dateStr,
    }),
  });
};

export const calender = fetchDatewiseData;



// TEST TAKEN GRAPH API
export const fetchTestCountData = async () => {
  const token = sessionStorage.getItem("access_token");
  if (!token) throw new Error("No authentication token found");

  const decoded = jwtDecode(token);
  const loginId = decoded?.data?.clinic_id;
  if (!loginId) throw new Error("Login ID not found in token");

  return apiFetcher(API_ENDPOINTS.TESTTAKENGRAPH.NUMBEROFTEST, {
    method: "POST",
    body: JSON.stringify({
    login_id: loginId,
    //login_id: "OFFC"
    }),
  });
};



// --- Dashboard totals: total_tests, test_used, subject_count, percentage ---
export const fetchClinicTestStats = async () => {
  const token = sessionStorage.getItem("access_token");
  if (!token) throw new Error("No authentication token found");

  const decoded = jwtDecode(token);
  const clinicId = decoded?.data?.clinic_id;
  if (!clinicId) throw new Error("Clinic ID not found in token");

  // POST { clinic_id } to fetch clinic stats
  return apiFetcher(API_ENDPOINTS.DASHBOARD.TOTALTEST, {
    method: "POST",
    body: JSON.stringify({ 

      //clinic_id: "CLN68c9227a580dd" 
    clinic_id: clinicId
    }),
  });
};
