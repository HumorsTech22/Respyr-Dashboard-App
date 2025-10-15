
// // config/fetcher.js
// import { API_BASE_URL } from "./apiConfig";
// import { refreshAndUpdateToken, isTokenExpired } from "../services/authService";

// export async function apiFetcher(endpoint, options = {}) {
//   try {
//     // Get current token
//     let token = typeof window !== 'undefined' ? sessionStorage.getItem("access_token") : null;

//     // Check if token is expired before making request
//     if (token && isTokenExpired(token)) {
//       console.log("Token expired, refreshing before request...");
//       token = await refreshAndUpdateToken();
//     }

//     const headers = {
//       'Content-Type': 'application/json',
//       ...(token && { Authorization: `Bearer ${token}` }),
//       ...options.headers,
//     };

//     const res = await fetch(`${API_BASE_URL}${endpoint}`, {
//       headers,
//       ...options,
//     });
// console.log("res27:-", res);
//     // If unauthorized, try to refresh token and retry
//     if (res.status === 401) {
//       console.log("Received 401, attempting token refresh...");
      
//       try {
//         // Refresh token
//         const newToken = await refreshAndUpdateToken();
        
//         // Retry the request with new token
//         const retryRes = await fetch(`${API_BASE_URL}${endpoint}`, {
//           ...options,
//           headers: {
//             ...headers,
//             Authorization: `Bearer ${newToken}`,
//           },
//         });
//         console.log("retryRes44:-", retryRes);

//         const retryData = await retryRes.json();
//  console.log("retryData47:-", retryData);
//         if (!retryRes.ok || retryData.status === 'error') {
//           const errorMessage = retryData.error || retryData.message || `Request failed with status ${retryRes.status}`;
//           const error = new Error(errorMessage);
//           error.status = retryRes.status;
//           error.data = retryData;
//           error.isApiError = true;
//           throw error;
//         }

//         return retryData;
//       } catch (refreshError) {
//         console.error("Token refresh failed:", refreshError);
        
//         // If refresh fails, clear storage and throw error
//         if (typeof window !== 'undefined') {
//           sessionStorage.removeItem("access_token");
//           sessionStorage.removeItem("refresh_token");
//           sessionStorage.removeItem("clinic");
//         }
        
//         throw new Error("Authentication failed. Please login again.");
//       }
//     }

//     const data = await res.json();

//     // Check if the response indicates an error
//     if (!res.ok || data.status === 'error') {
//       const errorMessage = data.error || data.message || `Request failed with status ${res.status}`;
//       const error = new Error(errorMessage);
//       error.status = res.status;
//       error.data = data;
//       error.isApiError = true;
//       throw error;
//     }

//     return data;
//   } catch (error) {
//     if (!error.isApiError) {
//       console.error("API Fetch Error:", error);
//     }
//     throw error;
//   }
// }


















// // config/fetcher.js
// import { API_BASE_URL } from "./apiConfig";
// import { refreshAndUpdateToken, isTokenExpired, getAccessToken, clearAuthStorage } from "../services/authService";

// let isRefreshing = false;
// let refreshSubscribers = [];

// // Subscribe to token refresh
// const subscribeTokenRefresh = (callback) => {
//   refreshSubscribers.push(callback);
// };

// // Notify all subscribers when token is refreshed
// const onTokenRefreshed = (token) => {
//   refreshSubscribers.forEach(callback => callback(token));
//   refreshSubscribers = [];
// };

// export async function apiFetcher(endpoint, options = {}) {
//   // Get current token
//   let token = getAccessToken();

//   // Prepare headers
//   const headers = {
//     'Content-Type': 'application/json',
//     ...(token && { Authorization: `Bearer ${token}` }),
//     ...options.headers,
//   };

//   try {
//     // Check if token is expired before making request
//     if (token && isTokenExpired(token)) {
//       console.log("Token expired, refreshing before request...");
      
//       if (!isRefreshing) {
//         isRefreshing = true;
//         try {
//           token = await refreshAndUpdateToken();
//           isRefreshing = false;
//           onTokenRefreshed(token);
//           // Update Authorization header with new token
//           headers.Authorization = `Bearer ${token}`;
//         } catch (error) {
//           isRefreshing = false;
//           refreshSubscribers = [];
//           throw error;
//         }
//       } else {
//         // If already refreshing, wait for the refresh to complete
//         return new Promise((resolve, reject) => {
//           subscribeTokenRefresh((newToken) => {
//             // Retry the original request with new token
//             apiFetcher(endpoint, {
//               ...options,
//               headers: {
//                 ...headers,
//                 Authorization: `Bearer ${newToken}`,
//               },
//             })
//               .then(resolve)
//               .catch(reject);
//           });
//         });
//       }
//     }

//     const res = await fetch(`${API_BASE_URL}${endpoint}`, {
//       headers,
//       ...options,
//     });

//     // If unauthorized, try to refresh token and retry
//     if (res.status === 401) {
//       console.log("Received 401, attempting token refresh...");
      
//       // Don't try to refresh if we're already in a refresh process
//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           subscribeTokenRefresh((newToken) => {
//             // Retry the original request with new token
//             apiFetcher(endpoint, {
//               ...options,
//               headers: {
//                 ...headers,
//                 Authorization: `Bearer ${newToken}`,
//               },
//             })
//               .then(resolve)
//               .catch(reject);
//           });
//         });
//       }

//       isRefreshing = true;
//       try {
//         // Refresh token
//         const newToken = await refreshAndUpdateToken();
//         isRefreshing = false;
//         onTokenRefreshed(newToken);
        
//         // Retry the request with new token
//         const retryRes = await fetch(`${API_BASE_URL}${endpoint}`, {
//           ...options,
//           headers: {
//             ...headers,
//             Authorization: `Bearer ${newToken}`,
//           },
//         });

//         const retryData = await retryRes.json();

//         if (!retryRes.ok || retryData.status === 'error') {
//           const errorMessage = retryData.error || retryData.message || `Request failed with status ${retryRes.status}`;
//           const error = new Error(errorMessage);
//           error.status = retryRes.status;
//           error.data = retryData;
//           error.isApiError = true;
//           throw error;
//         }

//         return retryData;
//       } catch (refreshError) {
//         isRefreshing = false;
//         refreshSubscribers = [];
//         console.error("Token refresh failed:", refreshError);
        
//         // If refresh fails, clear storage
//         clearAuthStorage();
//         throw new Error("Authentication failed. Please login again.");
//       }
//     }

//     const data = await res.json();

//     // Check if the response indicates an error
//     if (!res.ok || data.status === 'error') {
//       const errorMessage = data.error || data.message || `Request failed with status ${res.status}`;
//       const error = new Error(errorMessage);
//       error.status = res.status;
//       error.data = data;
//       error.isApiError = true;
//       throw error;
//     }

//     return data;
//   } catch (error) {
//     if (!error.isApiError) {
//       console.error("API Fetch Error:", error);
//     }
//     throw error;
//   }
// }












// config/fetcher.js
import { API_BASE_URL } from "./apiConfig";
import { refreshAndUpdateToken, isTokenExpired } from "../services/authService";

export async function apiFetcher(endpoint, options = {}) {
  try {
    // Get current token
    let token = typeof window !== "undefined" ? sessionStorage.getItem("access_token") : null;

    // Check if token is expired before making request
    if (token && isTokenExpired(token)) {
      console.log("Token expired, refreshing before request...");
      token = await refreshAndUpdateToken();
    }

    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers,
      ...options,
    });

    // If unauthorized, try to refresh token and retry
    if (res.status === 401) {
      console.log("Received 401, attempting token refresh...");

      try {
        // Refresh token
        const newToken = await refreshAndUpdateToken();

        // Retry the request with new token
        const retryRes = await fetch(`${API_BASE_URL}${endpoint}`, {
          ...options,
          headers: {
            ...headers,
            Authorization: `Bearer ${newToken}`,
          },
        });
        console.log("retryRes44:-", retryRes);

        const retryData = await retryRes.json();
        console.log("retryData47:-", retryData);

        if (!retryRes.ok || retryData.status === "error") {
          const errorMessage =
            retryData.error || retryData.message || `Request failed with status ${retryRes.status}`;
          const error = new Error(errorMessage);
          error.status = retryRes.status;
          error.data = retryData;
          error.isApiError = true;
          throw error;
        }

        return retryData;
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);

        // If refresh fails, clear storage and throw error
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("access_token");
          sessionStorage.removeItem("refresh_token");
          sessionStorage.removeItem("clinic");
        }

        throw new Error("Authentication failed. Please login again.");
      }
    }

    const data = await res.json();

    // Check if the response indicates an error
    if (!res.ok || data.status === "error") {
      const errorMessage =
        data.error || data.message || `Request failed with status ${res.status}`;
      const error = new Error(errorMessage);
      error.status = res.status;
      error.data = data;
      error.isApiError = true;
      throw error;
    }

    return data;
  } catch (error) {
    if (!error.isApiError) {
      console.error("API Fetch Error:", error);
    }
    throw error;
  }
}
