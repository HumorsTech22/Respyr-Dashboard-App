// config/fetcher.js
import { API_BASE_URL } from "./apiConfig";

export async function apiFetcher(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });


    const data = await res.json();

    // Check if the response indicates an error
    if (!res.ok || data.status === 'error') {
      const errorMessage = data.error || data.message || `Request failed with status ${res.status}`;

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