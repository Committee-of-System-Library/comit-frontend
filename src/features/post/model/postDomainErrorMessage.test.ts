import { describe, expect, it } from "vitest";

import { resolvePostDomainErrorMessage } from "./postDomainErrorMessage";

import { ApiHttpError } from "@/shared/api/http-error";

describe("resolvePostDomainErrorMessage", () => {
  it("maps known kinds through the provided preset", () => {
    const error = new ApiHttpError({
      kind: "forbidden",
      message: "원본 메시지",
      method: "POST",
      status: 403,
      url: "/api/posts/1/like",
    });

    expect(
      resolvePostDomainErrorMessage(error, {
        default: "기본 메시지",
        forbidden: "이 게시글에는 좋아요를 누를 수 없어요.",
      }),
    ).toBe("이 게시글에는 좋아요를 누를 수 없어요.");
  });

  it("falls back to the normalized error message when no preset override exists", () => {
    const error = new ApiHttpError({
      kind: "conflict",
      message: "이미 처리된 요청입니다.",
      method: "POST",
      status: 409,
      url: "/api/posts",
    });

    expect(
      resolvePostDomainErrorMessage(error, {
        default: "기본 메시지",
      }),
    ).toBe("이미 처리된 요청입니다.");
  });

  it("supports functional overrides for validation-style responses", () => {
    const error = new ApiHttpError({
      invalidFields: [
        {
          field: "title",
          message: "제목은 필수입니다.",
        },
      ],
      kind: "validation",
      message: "제목을 입력해 주세요.",
      method: "POST",
      status: 400,
      url: "/api/posts",
    });

    expect(
      resolvePostDomainErrorMessage(error, {
        default: "기본 메시지",
        validation: (normalizedError) =>
          normalizedError.invalidFields?.[0]?.message ?? "검증 실패",
      }),
    ).toBe("제목은 필수입니다.");
  });
});
