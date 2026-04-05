import { describe, expect, it } from "vitest";

import { isApiHttpError } from "@/shared/api/http-error";
import {
  createApiHttpError,
  readResponsePayload,
} from "@/shared/api/problem-detail";

describe("problem-detail normalization", () => {
  it("keeps structured ProblemDetail metadata on ApiHttpError", () => {
    const error = createApiHttpError({
      method: "POST",
      payload: {
        detail: "제목을 입력해 주세요.",
        errorCode: "POST_TITLE_REQUIRED",
        errorTrackingId: "trace-123",
        invalidFields: [
          {
            field: "title",
            reason: "required",
          },
        ],
        status: 400,
        title: "요청이 올바르지 않습니다.",
      },
      status: 400,
      statusText: "Bad Request",
      url: "/api/posts",
    });

    expect(isApiHttpError(error)).toBe(true);
    expect(error.kind).toBe("validation");
    expect(error.status).toBe(400);
    expect(error.code).toBe("POST_TITLE_REQUIRED");
    expect(error.errorCode).toBe("POST_TITLE_REQUIRED");
    expect(error.detail).toBe("제목을 입력해 주세요.");
    expect(error.title).toBe("요청이 올바르지 않습니다.");
    expect(error.trackingId).toBe("trace-123");
    expect(error.invalidFields).toEqual([
      {
        field: "title",
        reason: "required",
      },
    ]);
    expect(error.isRetryable).toBe(false);
  });

  it("reads non-JSON and malformed JSON bodies without throwing", async () => {
    const textResponse = new Response("Service unavailable", {
      headers: {
        "content-type": "text/plain",
      },
      status: 503,
      statusText: "Service Unavailable",
    });

    const jsonResponse = new Response("{invalid json", {
      headers: {
        "content-type": "application/json",
      },
      status: 500,
      statusText: "Internal Server Error",
    });

    await expect(readResponsePayload(textResponse)).resolves.toBe(
      "Service unavailable",
    );
    await expect(readResponsePayload(jsonResponse)).resolves.toBe(
      "{invalid json",
    );
  });
});
