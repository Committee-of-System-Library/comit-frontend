export interface ApiSuccessResponse<TData = unknown> {
  result: string;
  data?: TData;
}

export interface ApiInvalidField {
  field: string;
  reason: string;
  rejectedValue?: string;
}

export interface ApiErrorResponse {
  type?: string;
  title?: string;
  status: number;
  detail?: string;
  instance?: string;
  code?: string;
  errorCode?: string;
  message?: string;
  invalidFields?: ApiInvalidField[];
  trackingId?: string;
  errorTrackingId?: string;
  timestamp?: string;
}

const isObject = (value: unknown): value is Record<string, unknown> => {
  return value !== null && typeof value === "object";
};

export const isApiSuccessResponse = <TData = unknown>(
  value: unknown,
): value is ApiSuccessResponse<TData> => {
  if (!isObject(value)) {
    return false;
  }

  return typeof value.result === "string";
};

export const isApiErrorResponse = (
  value: unknown,
): value is ApiErrorResponse => {
  if (!isObject(value)) {
    return false;
  }

  return (
    typeof value.status === "number" &&
    (typeof value.title === "string" ||
      typeof value.message === "string" ||
      typeof value.detail === "string" ||
      typeof value.errorCode === "string" ||
      typeof value.code === "string")
  );
};
