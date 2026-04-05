import { describe, expect, it } from "vitest";

import { normalizePostDomainError } from "./postDomainError";

import { ApiHttpError } from "@/shared/api/http-error";

describe("normalizePostDomainError", () => {
  it("projects ApiHttpError fields into a post-domain friendly shape", () => {
    const apiError = new ApiHttpError({
      code: "POST_NOT_FOUND",
      kind: "not_found",
      message: "게시글을 찾을 수 없습니다.",
      method: "GET",
      status: 404,
      title: "Not Found",
      trackingId: "trace-404",
      url: "/api/posts/404",
    });

    const normalized = normalizePostDomainError(apiError);

    expect(normalized.kind).toBe("not_found");
    expect(normalized.status).toBe(404);
    expect(normalized.code).toBe("POST_NOT_FOUND");
    expect(normalized.message).toBe("게시글을 찾을 수 없습니다.");
    expect(normalized.title).toBe("Not Found");
    expect(normalized.trackingId).toBe("trace-404");
    expect(normalized.url).toBe("/api/posts/404");
  });

  it("falls back to an unknown error shape for plain errors", () => {
    const normalized = normalizePostDomainError(new Error("boom"));

    expect(normalized.kind).toBe("unknown");
    expect(normalized.status).toBe(0);
    expect(normalized.message).toBe("boom");
    expect(normalized.title).toBe("boom");
  });
});
