import { ApiHttpError, type ApiErrorKind } from "@/shared/api/http-error";
import type { ApiErrorResponse, ApiInvalidField } from "@/shared/api/response";

const isObject = (value: unknown): value is Record<string, unknown> => {
  return value !== null && typeof value === "object";
};

const asNonEmptyString = (value: unknown): string | undefined => {
  if (typeof value !== "string") {
    return undefined;
  }

  return value.trim().length > 0 ? value : undefined;
};

const isAbortError = (error: unknown) => {
  if (error instanceof DOMException) {
    return error.name === "AbortError";
  }

  return error instanceof Error && error.name === "AbortError";
};

const shouldParseAsJson = (contentType: string, rawBody: string) => {
  if (contentType.includes("json")) {
    return true;
  }

  const trimmedBody = rawBody.trimStart();

  return trimmedBody.startsWith("{") || trimmedBody.startsWith("[");
};

const normalizeInvalidFields = (
  value: unknown,
): ApiInvalidField[] | undefined => {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const invalidFields = value
    .map((item) => {
      if (!isObject(item)) {
        return null;
      }

      const field = asNonEmptyString(item.field);
      const reason = asNonEmptyString(item.reason);

      if (!field || !reason) {
        return null;
      }

      const normalizedField: ApiInvalidField = {
        field,
        reason,
      };

      const rejectedValue = asNonEmptyString(item.rejectedValue);

      if (rejectedValue !== undefined) {
        normalizedField.rejectedValue = rejectedValue;
      }

      return normalizedField;
    })
    .filter((item): item is ApiInvalidField => item !== null);

  return invalidFields.length > 0 ? invalidFields : undefined;
};

const normalizeErrorResponse = (
  payload: unknown,
): Partial<ApiErrorResponse> & { rawMessage?: string } => {
  if (typeof payload === "string") {
    const rawMessage = asNonEmptyString(payload);

    return rawMessage ? { rawMessage } : {};
  }

  if (!isObject(payload)) {
    return {};
  }

  const title = asNonEmptyString(payload.title);
  const detail = asNonEmptyString(payload.detail);
  const message = asNonEmptyString(payload.message);
  const code =
    asNonEmptyString(payload.errorCode) ?? asNonEmptyString(payload.code);
  const trackingId =
    asNonEmptyString(payload.errorTrackingId) ??
    asNonEmptyString(payload.trackingId);

  return {
    code,
    detail,
    errorCode: code,
    instance: asNonEmptyString(payload.instance),
    invalidFields: normalizeInvalidFields(payload.invalidFields),
    message,
    rawMessage: title ?? detail ?? message,
    status: typeof payload.status === "number" ? payload.status : undefined,
    title,
    trackingId,
    type: asNonEmptyString(payload.type),
  };
};

export const classifyApiErrorKind = (
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

export const readResponsePayload = async (response: Response) => {
  if (response.status === 204) {
    return undefined;
  }

  const rawBody = await response.text();

  if (rawBody.length === 0) {
    return undefined;
  }

  const contentType = response.headers.get("content-type") ?? "";

  if (!shouldParseAsJson(contentType, rawBody)) {
    return rawBody;
  }

  try {
    return JSON.parse(rawBody) as unknown;
  } catch {
    return rawBody;
  }
};

interface CreateApiHttpErrorOptions {
  method: string;
  payload?: unknown;
  status: number;
  statusText?: string;
  url: string;
}

export const createApiHttpError = ({
  method,
  payload,
  status,
  statusText,
  url,
}: CreateApiHttpErrorOptions) => {
  const normalized = normalizeErrorResponse(payload);
  const resolvedStatus = normalized.status ?? status;
  const kind = classifyApiErrorKind(resolvedStatus, normalized.invalidFields);
  const fallbackMessage =
    normalized.rawMessage ??
    statusText ??
    `${method} ${url} failed with status ${resolvedStatus}`;
  const message =
    normalized.detail ??
    normalized.message ??
    normalized.title ??
    fallbackMessage;

  return new ApiHttpError({
    code: normalized.code,
    detail: normalized.detail,
    errorCode: normalized.errorCode,
    instance: normalized.instance,
    invalidFields: normalized.invalidFields,
    isRetryable: kind === "network" || kind === "server",
    kind,
    message,
    method,
    payload,
    status: resolvedStatus,
    title: normalized.title ?? message,
    trackingId: normalized.trackingId,
    url,
  });
};

export const isAbortFetchError = isAbortError;
