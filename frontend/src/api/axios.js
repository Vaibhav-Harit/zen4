import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/",
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("snapit_access");
    if (token) {
      config.headers.Authorization = "Bearer " + token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("snapit_refresh");

      if (!refreshToken) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(
          "/api/auth/refresh/",
          { refresh: refreshToken }
        );

        localStorage.setItem("snapit_access", data.access);
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers["Authorization"] = "Bearer " + data.access;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
