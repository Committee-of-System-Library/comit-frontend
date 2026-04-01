import { ApiHttpError } from "@/shared/api/http-error";
import {
  isApiErrorResponse,
  isApiSuccessResponse,
} from "@/shared/api/response";

type HttpMethod = "DELETE" | "GET" | "PATCH" | "POST" | "PUT";

type QueryPrimitive = boolean | number | string;

type QueryValue = null | QueryPrimitive | QueryPrimitive[] | undefined;

type QueryParams = Record<string, QueryValue>;

type NativeBodyInit = globalThis.BodyInit;
type NativeHeadersInit = globalThis.HeadersInit;
type NativeRequestInit = globalThis.RequestInit;

interface ApiRequestOptions extends Omit<
  NativeRequestInit,
  "body" | "headers" | "method"
> {
  body?: NativeBodyInit | null | object;
  headers?: NativeHeadersInit;
  method?: HttpMethod;
  params?: QueryParams;
  skipBaseUrl?: boolean;
  unwrapData?: boolean;
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").trim();

const isAbsoluteUrl = (path: string) => {
  return /^https?:\/\//.test(path);
};

const joinUrl = (base: string, path: string) => {
  const normalizedBase = base.replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${normalizedBase}${normalizedPath}`;
};

const buildUrl = (path: string, params?: QueryParams, skipBaseUrl = false) => {
  const resolvedPath = skipBaseUrl || isAbsoluteUrl(path) ? path : path;
  const baseResolvedPath =
    skipBaseUrl || isAbsoluteUrl(resolvedPath) || API_BASE_URL.length === 0
      ? resolvedPath
      : joinUrl(API_BASE_URL, resolvedPath);

  const url = new URL(
    baseResolvedPath,
    typeof window !== "undefined" ? window.location.origin : "http://localhost",
  );

  if (params) {
    Object.entries(params).forEach(([key, rawValue]) => {
      if (rawValue === undefined || rawValue === null) {
        return;
      }

      if (Array.isArray(rawValue)) {
        rawValue.forEach((value) => {
          url.searchParams.append(key, String(value));
        });
        return;
      }

      url.searchParams.set(key, String(rawValue));
    });
  }

  if (skipBaseUrl || isAbsoluteUrl(baseResolvedPath)) {
    return url.toString();
  }

  return `${url.pathname}${url.search}`;
};

const isJsonBody = (body: unknown): body is object => {
  if (body === null || body === undefined) {
    return false;
  }

  if (
    body instanceof Blob ||
    body instanceof FormData ||
    body instanceof ArrayBuffer ||
    body instanceof URLSearchParams ||
    typeof body === "string"
  ) {
    return false;
  }

  if (ArrayBuffer.isView(body)) {
    return false;
  }

  return typeof body === "object";
};

const parseResponsePayload = async (response: Response) => {
  if (response.status === 204) {
    return undefined;
  }

  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
};

const request = async <TResponse = unknown>(
  path: string,
  options: ApiRequestOptions = {},
) => {
  const {
    body,
    headers,
    method = "GET",
    params,
    skipBaseUrl = false,
    unwrapData = true,
    ...init
  } = options;
  const requestUrl = buildUrl(path, params, skipBaseUrl);
  const normalizedHeaders = new Headers(headers);

  if (isJsonBody(body) && !normalizedHeaders.has("Content-Type")) {
    normalizedHeaders.set("Content-Type", "application/json");
  }

  const response = await fetch(requestUrl, {
    ...init,
    body:
      body === undefined
        ? undefined
        : body === null
          ? null
          : isJsonBody(body)
            ? JSON.stringify(body)
            : body,
    credentials: "include",
    headers: normalizedHeaders,
    method,
  });
  const payload = await parseResponsePayload(response);

  if (!response.ok) {
    if (isApiErrorResponse(payload)) {
      throw new ApiHttpError({
        detail: payload.detail,
        errorCode: payload.errorCode,
        invalidFields: payload.invalidFields,
        message: payload.title,
        method,
        payload,
        status: response.status,
        trackingId: payload.errorTrackingId,
        url: requestUrl,
      });
    }

    throw new ApiHttpError({
      message: `${method} ${requestUrl} failed with status ${response.status}`,
      method,
      payload,
      status: response.status,
      url: requestUrl,
    });
  }

  if (payload === undefined) {
    return undefined as TResponse;
  }

  if (unwrapData && isApiSuccessResponse(payload)) {
    return payload.data as TResponse;
  }

  return payload as TResponse;
};

export const apiClient = {
  delete: <TResponse = unknown>(
    path: string,
    options: ApiRequestOptions = {},
  ) => request<TResponse>(path, { ...options, method: "DELETE" }),
  get: <TResponse = unknown>(path: string, options: ApiRequestOptions = {}) =>
    request<TResponse>(path, { ...options, method: "GET" }),
  patch: <TResponse = unknown>(path: string, options: ApiRequestOptions = {}) =>
    request<TResponse>(path, { ...options, method: "PATCH" }),
  post: <TResponse = unknown>(path: string, options: ApiRequestOptions = {}) =>
    request<TResponse>(path, { ...options, method: "POST" }),
  put: <TResponse = unknown>(path: string, options: ApiRequestOptions = {}) =>
    request<TResponse>(path, { ...options, method: "PUT" }),
  request,
};
