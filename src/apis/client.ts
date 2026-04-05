import {
  createApiHttpError,
  isAbortFetchError,
  readResponsePayload,
} from "@/shared/api/problem-detail";

type QueryValue = string | number | boolean | null | undefined;

type QueryParams = object;

interface ApiResponse<T> {
  result: "SUCCESS";
  data: T;
  code?: string | null;
  message?: string | null;
}

interface RequestOptions {
  body?: unknown;
  headers?: Record<string, string>;
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  params?: QueryParams;
  signal?: AbortSignal;
}

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(
    /\/$/,
    "",
  ) ?? "/api";

const buildQueryString = (params?: QueryParams) => {
  if (!params) {
    return "";
  }

  const searchParams = new URLSearchParams();

  Object.entries(params as Record<string, QueryValue>).forEach(
    ([key, value]) => {
      if (value === undefined || value === null || value === "") {
        return;
      }

      searchParams.set(key, String(value));
    },
  );

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
};

export const resolveApiUrl = (path: string, params?: QueryParams) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}${buildQueryString(params)}`;
};

async function request<T>(path: string, options: RequestOptions = {}) {
  const { body, headers, method = "GET", params, signal } = options;
  const requestUrl = resolveApiUrl(path, params);

  let response: Response;

  try {
    response = await fetch(requestUrl, {
      method,
      signal,
      credentials: "include",
      headers: {
        Accept: "application/json",
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    if (isAbortFetchError(error)) {
      throw error;
    }

    throw createApiHttpError({
      method,
      payload: error,
      status: 0,
      statusText: "Network Error",
      url: requestUrl,
    });
  }

  if (!response.ok) {
    const payload = await readResponsePayload(response);

    throw createApiHttpError({
      method,
      payload,
      status: response.status,
      statusText: response.statusText,
      url: requestUrl,
    });
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const payload = (await response.json()) as ApiResponse<T>;
  return payload.data;
}

export const client = {
  delete: <T>(path: string, options?: Omit<RequestOptions, "method">) =>
    request<T>(path, { ...options, method: "DELETE" }),
  get: <T>(path: string, options?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...options, method: "GET" }),
  patch: <T>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method" | "body">,
  ) => request<T>(path, { ...options, body, method: "PATCH" }),
  post: <T>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method" | "body">,
  ) => request<T>(path, { ...options, body, method: "POST" }),
};
