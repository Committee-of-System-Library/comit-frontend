const APP_BASE_URL = (import.meta.env.VITE_APP_BASE_URL ?? "").trim();

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

export const resolveAppBaseUrl = () => {
  if (APP_BASE_URL.length > 0) {
    return trimTrailingSlash(APP_BASE_URL);
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
    if (import.meta.env.DEV) {
      console.warn("공유 URL base를 확인하지 못해 상대 경로를 사용합니다.");
    }

    return normalizedPath;
  }

  return `${baseUrl}${normalizedPath}`;
};
