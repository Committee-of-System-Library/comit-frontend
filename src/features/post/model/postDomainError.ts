import {
  ApiHttpError,
  isApiHttpError,
  type ApiErrorKind,
} from "@/shared/api/http-error";
import type { ApiInvalidField } from "@/shared/api/response";

export type PostDomainErrorKind = ApiErrorKind;

export interface PostDomainError {
  code?: string;
  detail?: string;
  instance?: string;
  invalidFields?: ApiInvalidField[];
  isRetryable: boolean;
  kind: PostDomainErrorKind;
  message: string;
  method?: string;
  raw?: unknown;
  status: number;
  title: string;
  trackingId?: string;
  url?: string;
}

const isAbortError = (error: unknown) => {
  if (error instanceof DOMException) {
    return error.name === "AbortError";
  }

  return error instanceof Error && error.name === "AbortError";
};

const defaultMessage = "게시글 요청에 실패했습니다.";

const toPostDomainError = (error: ApiHttpError): PostDomainError => {
  return {
    code: error.code ?? error.errorCode,
    detail: error.detail,
    instance: error.instance,
    invalidFields: error.invalidFields,
    isRetryable: error.isRetryable,
    kind: error.kind,
    message: error.message,
    method: error.method,
    raw: error.payload,
    status: error.status,
    title: error.title,
    trackingId: error.trackingId,
    url: error.url,
  };
};

export const normalizePostDomainError = (error: unknown): PostDomainError => {
  if (isApiHttpError(error)) {
    return toPostDomainError(error);
  }

  if (isAbortError(error)) {
    return {
      isRetryable: true,
      kind: "network",
      message: defaultMessage,
      raw: error,
      status: 0,
      title: defaultMessage,
    };
  }

  if (error instanceof Error) {
    return {
      isRetryable: false,
      kind: "unknown",
      message: error.message || defaultMessage,
      raw: error,
      status: 0,
      title: error.message || defaultMessage,
    };
  }

  if (typeof error === "string" && error.trim().length > 0) {
    return {
      isRetryable: false,
      kind: "unknown",
      message: error,
      raw: error,
      status: 0,
      title: error,
    };
  }

  return {
    isRetryable: false,
    kind: "unknown",
    message: defaultMessage,
    raw: error,
    status: 0,
    title: defaultMessage,
  };
};

export const isPostDomainError = (error: unknown): error is PostDomainError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "kind" in error &&
    "status" in error &&
    "message" in error &&
    "title" in error
  );
};
