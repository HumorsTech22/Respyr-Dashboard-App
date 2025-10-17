// config/apiConfig.js

// Base URLs (different for local, staging, prod)
export const API_BASE_URL =
process.env.NEXT_PUBLIC_API_BASE_URL  || "https://humorstech.com";

// Centralized API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/clinicalapp/api/login.php",
    REFRESH_TOKEN: "/clinicalapp/api/refresh_token.php",
  },
  SUBJECTS:{
    TABLE:"/clinicalapp/api/fetch_subjects.php",
    PROFILE:"/clinicalapp/api/fetch_clinical_scores1.php"
  },
  TEST:{
    HISTORY:"/clinicalapp/api/fetch_clinic_history.php"
  },
  CALENDER:{
    DATEWISE:"/clinicalapp/api/fetch_data_by_date.php"
  },
  TESTTAKENGRAPH:{
    NUMBEROFTEST:"/clinicalapp/api/test_count.php"
  },
  DASHBOARD:{
    TOTALTEST:"/clinicalapp/api/fetch_clinic_test_stat.php"
  }

  
};
