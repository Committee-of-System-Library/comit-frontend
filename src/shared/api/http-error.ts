import type { ApiInvalidField } from "@/shared/api/response";

export type ApiErrorKind =
  | "validation"
  | "auth"
  | "forbidden"
  | "not_found"
  | "conflict"
  | "network"
  | "server"
  | "unknown";

interface ApiHttpErrorOptions {
  status: number;
  message: string;
  method: string;
  url: string;
  title?: string;
  detail?: string;
  code?: string;
  errorCode?: string;
  instance?: string;
  invalidFields?: ApiInvalidField[];
  kind?: ApiErrorKind;
  isRetryable?: boolean;
  trackingId?: string;
  payload?: unknown;
}

const resolveDefaultKind = (
  status: number,
  invalidFields?: ApiInvalidField[],
): ApiErrorKind => {
  if (status === 0) {
    return "network";
  }

  if (status === 400 && (invalidFields?.length ?? 0) > 0) {
    return "validation";
  }

  if (status === 401) {
    return "auth";
  }

  if (status === 403) {
    return "forbidden";
  }

  if (status === 404) {
    return "not_found";
  }

  if (status === 409) {
    return "conflict";
  }

  if (status >= 500) {
    return "server";
  }

  return "unknown";
};

const resolveDefaultRetryable = (kind: ApiErrorKind, status: number) => {
  if (kind === "network" || kind === "server") {
    return true;
  }

  return status >= 500;
};

export class ApiHttpError extends Error {
  readonly status: number;
  readonly method: string;
  readonly url: string;
  readonly title: string;
  readonly detail?: string;
  readonly code?: string;
  readonly errorCode?: string;
  readonly instance?: string;
  readonly invalidFields?: ApiInvalidField[];
  readonly kind: ApiErrorKind;
  readonly isRetryable: boolean;
  readonly trackingId?: string;
  readonly payload?: unknown;

  constructor(options: ApiHttpErrorOptions) {
    super(options.message);
    this.name = "ApiHttpError";
    this.status = options.status;
    this.method = options.method;
    this.url = options.url;
    this.title = options.title ?? options.message;
    this.detail = options.detail;
    this.code = options.code ?? options.errorCode;
    this.errorCode = options.errorCode;
    this.instance = options.instance;
    this.invalidFields = options.invalidFields;
    this.kind =
      options.kind ?? resolveDefaultKind(options.status, options.invalidFields);
    this.isRetryable =
      options.isRetryable ?? resolveDefaultRetryable(this.kind, options.status);
    this.trackingId = options.trackingId;
    this.payload = options.payload;
  }
}

export const isApiHttpError = (error: unknown): error is ApiHttpError => {
  return error instanceof ApiHttpError;
};
