import axios from "axios";

const adminAPI = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

adminAPI.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem(
      "csw_admin_token"
    );

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  }
);

adminAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401
    ) {
      sessionStorage.removeItem(
        "csw_admin_token"
      );

      sessionStorage.removeItem(
        "csw_admin_session"
      );
    }

    return Promise.reject(error);
  }
);

export default adminAPI;