import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

export const logout = () => {
  return apiClient.post<void>(API_ENDPOINTS.auth.ssoLogout);
};

export const getSsoLoginUrl = () => {
  const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? "").trim();

  if (!apiBaseUrl) {
    return API_ENDPOINTS.auth.ssoLogin;
  }

  const normalizedBase = apiBaseUrl.replace(/\/+$/, "");

  return `${normalizedBase}${API_ENDPOINTS.auth.ssoLogin}`;
};
