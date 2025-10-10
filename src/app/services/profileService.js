// services/profileService.js
import { apiFetcher } from "../config/fetcher";
import { API_ENDPOINTS } from "../config/apiConfig";
import { isTokenExpired, refreshAndUpdateToken } from "./authService";

export const fetchClinicalScores = async (clinicId, subjectId) => {
  let token = null;

  if (typeof window !== "undefined") {
    token = sessionStorage.getItem("access_token");
  }

  if (!token || isTokenExpired(token)) {
    token = await refreshAndUpdateToken(); 
  }

  return apiFetcher(API_ENDPOINTS.SUBJECTS.PROFILE, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      clinic_id: clinicId,
      subject_id: subjectId,
    }),
  });
};
