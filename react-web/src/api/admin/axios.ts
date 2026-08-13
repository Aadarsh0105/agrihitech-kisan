import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json"
  }
});

const syncAuthHeader = () => {
  const token = localStorage.getItem("token") ?? localStorage.getItem("ahk_admin_token");
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") ?? localStorage.getItem("ahk_admin_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  const language = localStorage.getItem("ahk_admin_locale") ?? "en";
  config.headers["Accept-Language"] = language;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("ahk_admin_token");
      localStorage.removeItem("token");
      syncAuthHeader();
    }
    return Promise.reject(error);
  }
);

syncAuthHeader();

export default api;
