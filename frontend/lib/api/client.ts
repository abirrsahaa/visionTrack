import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";

// Mock data mode configuration
// Defaults to true (mock mode) when no backend is available
// Set NEXT_PUBLIC_USE_MOCK_DATA=false in .env.local to use real backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api";
const USE_REAL_API = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "false";
const USE_MOCK_DATA = !USE_REAL_API; // Default to mock mode unless explicitly disabled

// Log mock mode status in development
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  console.log(
    USE_MOCK_DATA 
      ? "🔧 Mock Data Mode: ENABLED (no backend required)" 
      : `🌐 Real API Mode: Using backend at ${API_BASE_URL}`
  );
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// Request interceptor to attach auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken && config.headers) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        if (typeof window !== "undefined") {
          const refreshToken = localStorage.getItem("refreshToken");
          if (refreshToken) {
            const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
              refreshToken,
            });

            const { accessToken, refreshToken: newRefreshToken } = response.data.tokens;
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", newRefreshToken);

            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            }

            return apiClient(originalRequest);
          }
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Helper to check if we should use mock data
export const shouldUseMockData = (): boolean => {
  return USE_MOCK_DATA;
};