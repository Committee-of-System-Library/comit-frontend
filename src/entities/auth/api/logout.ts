import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

export const logout = () => {
  return apiClient.post<void>(API_ENDPOINTS.auth.ssoLogout);
};

interface GetSsoLoginUrlOptions {
  redirectUri?: string;
}

export const getSsoLoginUrl = (options: GetSsoLoginUrlOptions = {}) => {
  const { redirectUri } = options;
  const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? "").trim();
  const buildWithQuery = (baseUrl: string) => {
    const url = new URL(
      baseUrl,
      typeof window !== "undefined"
        ? window.location.origin
        : "http://localhost",
    );

    if (redirectUri) {
      url.searchParams.set("redirectUri", redirectUri);
    }

    return baseUrl.startsWith("http")
      ? url.toString()
      : `${url.pathname}${url.search}`;
  };

  if (!apiBaseUrl) {
    return buildWithQuery(API_ENDPOINTS.auth.ssoLogin);
  }

  const normalizedBase = apiBaseUrl.replace(/\/+$/, "");

  return buildWithQuery(`${normalizedBase}${API_ENDPOINTS.auth.ssoLogin}`);
};
