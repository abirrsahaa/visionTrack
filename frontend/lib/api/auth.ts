import { apiClient, shouldUseMockData } from "./client";
import type {
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  User,
} from "@/lib/types";
import {
  mockUser,
  mockAuthResponse,
} from "@/lib/utils/mockData";

// Auth API endpoints
export const authApi = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    if (shouldUseMockData()) {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log("✅ Using mock data for registration");
      return {
        ...mockAuthResponse,
        user: {
          ...mockUser,
          email: data.email,
          name: data.name,
          timezone: data.timezone,
        },
      };
    }

    console.log("⚠️ Attempting real API call (backend required)");
    const response = await apiClient.post<AuthResponse>("/auth/register", data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    if (shouldUseMockData()) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log("✅ Using mock data for login");
      return {
        ...mockAuthResponse,
        user: {
          ...mockUser,
          email: data.email,
        },
      };
    }

    console.log("⚠️ Attempting real API call (backend required)");
    const response = await apiClient.post<AuthResponse>("/auth/login", data);
    return response.data;
  },

  refresh: async (refreshToken: string): Promise<{ tokens: { accessToken: string; refreshToken: string } }> => {
    if (shouldUseMockData()) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return { tokens: mockAuthResponse.tokens };
    }

    const response = await apiClient.post<{ tokens: { accessToken: string; refreshToken: string } }>(
      "/auth/refresh",
      { refreshToken }
    );
    return response.data;
  },

  getMe: async (): Promise<User> => {
    if (shouldUseMockData()) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return mockUser;
    }

    const response = await apiClient.get<User>("/auth/me");
    return response.data;
  },
};