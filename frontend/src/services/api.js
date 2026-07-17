import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// ── Attach token to every request ──
API.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("csw_admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Handle 401 globally ──
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem("csw_admin_token");
      sessionStorage.removeItem("csw_admin_session");

      const currentPath = window.location.pathname;
      if (
        !currentPath.includes("/admin/login") &&
        !currentPath.includes("/admin/register")
      ) {
        window.location.href = "/admin";
      }
    }
    return Promise.reject(error);
  }
);

export default API;