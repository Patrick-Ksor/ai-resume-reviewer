import api from "./api";
import type { ApiResponse } from "@/types/api";
import type {
  User,
  AuthTokens,
  LoginPayload,
  RegisterPayload,
  UpdateProfilePayload,
  ChangePasswordPayload,
} from "@/types/auth";

interface AuthData {
  user: User;
  tokens: AuthTokens;
}

export const authService = {
  async login(payload: LoginPayload): Promise<AuthData> {
    const { data } = await api.post<ApiResponse<AuthData>>(
      "/auth/login",
      payload,
    );
    return data.data;
  },

  async register(payload: RegisterPayload): Promise<AuthData> {
    const { data } = await api.post<ApiResponse<AuthData>>(
      "/auth/register",
      payload,
    );
    return data.data;
  },

  async logout(): Promise<void> {
    await api.post("/auth/logout");
  },

  async getMe(): Promise<User> {
    const { data } = await api.get<ApiResponse<User>>("/auth/me");
    return data.data;
  },

  async updateProfile(payload: UpdateProfilePayload): Promise<User> {
    const { data } = await api.patch<ApiResponse<User>>(
      "/auth/profile",
      payload,
    );
    return data.data;
  },

  async changePassword(payload: ChangePasswordPayload): Promise<void> {
    await api.post("/auth/change-password", payload);
  },

  async deleteAccount(): Promise<void> {
    await api.delete("/auth/account");
  },
};
