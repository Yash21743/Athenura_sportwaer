import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Automatically attach the correct token — admin (sessionStorage) OR user (localStorage)
API.interceptors.request.use(
  (config) => {
    const adminToken = sessionStorage.getItem("csw_admin_token");
    const userToken = localStorage.getItem("csw_user_token");

    // Prefer admin token if present (admin panel session),
    // otherwise fall back to the logged-in user's token
    const token = adminToken || userToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  }
);

// ✅ Handle unauthorized — clear whichever session actually exists
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (sessionStorage.getItem("csw_admin_token")) {
        sessionStorage.removeItem("csw_admin_token");
        sessionStorage.removeItem("csw_admin_session");
      }

      if (localStorage.getItem("csw_user_token")) {
        localStorage.removeItem("csw_user_token");
        localStorage.removeItem("csw_user");
        localStorage.removeItem("csw_is_logged_in");
        localStorage.removeItem("csw_logged_user_email");
        window.dispatchEvent(new Event("userLoggedOut"));
      }
    }

    return Promise.reject(error);
  }
);

export default API;