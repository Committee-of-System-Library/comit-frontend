const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

export const resolveAppBaseUrl = () => {
  const appBaseUrl = (import.meta.env.VITE_APP_BASE_URL ?? "").trim();

  if (appBaseUrl.length > 0) {
    return trimTrailingSlash(appBaseUrl);
  }

  if (typeof window !== "undefined" && window.location.origin) {
    return trimTrailingSlash(window.location.origin);
  }

  return "";
};

export const buildPostShareUrl = (postId: number) => {
  const normalizedPath = `/post/${postId}`;
  const baseUrl = resolveAppBaseUrl();

  if (baseUrl.length === 0) {
    return normalizedPath;
  }

  return `${baseUrl}${normalizedPath}`;
};
