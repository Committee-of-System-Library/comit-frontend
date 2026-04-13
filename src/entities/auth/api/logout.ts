import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

export const logout = () => {
  return apiClient.post<void>(API_ENDPOINTS.auth.ssoLogout);
};

interface GetSsoLoginUrlOptions {
  redirectUri?: string;
}

const DEFAULT_SSO_LOGIN_URL =
  "https://chcse.knu.ac.kr/appfn/login?client_id=commit&redirect_uri=https%3A%2F%2Fchcse.knu.ac.kr%2Flocker%2Fcallback&state=295d8676-e569-4ed3-8a8a-f58c28f21a7c";

export const getSsoLoginUrl = (options: GetSsoLoginUrlOptions = {}) => {
  const { redirectUri } = options;
  const configuredSsoLoginUrl = (
    import.meta.env.VITE_SSO_LOGIN_URL ?? DEFAULT_SSO_LOGIN_URL
  ).trim();

  if (configuredSsoLoginUrl) {
    return configuredSsoLoginUrl;
  }

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
