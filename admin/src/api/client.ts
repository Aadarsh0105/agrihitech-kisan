import axios, { type AxiosInstance } from 'axios';

/**
 * Pre-configured Axios instance. Every future API call goes through this client.
 * Base URL comes from the environment so the same build works across stages.
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: '/api/v1',
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' }
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('ahk_admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  const language = localStorage.getItem('ahk_admin_locale') ?? 'en';
  config.headers['Accept-Language'] = language;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('ahk_admin_token');
    }
    return Promise.reject(error);
  }
);