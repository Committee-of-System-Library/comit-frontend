import { QueryClient } from "@tanstack/react-query";

import { isApiHttpError } from "@/shared/api/http-error";

const shouldRetry = (failureCount: number, error: unknown) => {
  if (isApiHttpError(error)) {
    const nonRetryableStatus = [400, 401, 403, 404, 409];

    if (nonRetryableStatus.includes(error.status)) {
      return false;
    }
  }

  return failureCount < 2;
};

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      retry: 0,
    },
    queries: {
      refetchOnWindowFocus: false,
      retry: shouldRetry,
      staleTime: 30 * 1000,
    },
  },
});
