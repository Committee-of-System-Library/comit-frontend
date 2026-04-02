import type { ApiInvalidField } from "@/shared/api/response";

interface ApiHttpErrorOptions {
  status: number;
  message: string;
  method: string;
  url: string;
  detail?: string;
  errorCode?: string;
  invalidFields?: ApiInvalidField[];
  trackingId?: string;
  payload?: unknown;
}

export class ApiHttpError extends Error {
  readonly status: number;
  readonly method: string;
  readonly url: string;
  readonly detail?: string;
  readonly errorCode?: string;
  readonly invalidFields?: ApiInvalidField[];
  readonly trackingId?: string;
  readonly payload?: unknown;

  constructor(options: ApiHttpErrorOptions) {
    super(options.message);
    this.name = "ApiHttpError";
    this.status = options.status;
    this.method = options.method;
    this.url = options.url;
    this.detail = options.detail;
    this.errorCode = options.errorCode;
    this.invalidFields = options.invalidFields;
    this.trackingId = options.trackingId;
    this.payload = options.payload;
  }
}

export const isApiHttpError = (error: unknown): error is ApiHttpError => {
  return error instanceof ApiHttpError;
};
