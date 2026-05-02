import { describe, expect, it } from "vitest";

import {
  LIST_CONTENT_PREVIEW_FALLBACK,
  normalizeContentPreview,
  resolveContentPreview,
} from "@/utils/contentPreview";

describe("contentPreview", () => {
  it("목록 미리보기에서 마크다운 문법을 제거한다", () => {
    const preview = `
      # 마크다운 테스트
      ## 현재 텍스트 **강조**
      > 인용문
      - 목록
      [blue]파란 텍스트[/blue]
      [red]빨간 텍스트[/red]
    `;

    expect(normalizeContentPreview(preview)).toBe(
      "마크다운 테스트 현재 텍스트 강조 인용문 목록 파란 텍스트 빨간 텍스트",
    );
  });

  it("한 줄로 합쳐진 preview에서도 하위 마크다운 토큰을 제거한다", () => {
    const preview =
      "마크다운 테스트 ## 현재 텍스트 **강조** > 인용문 - 목록 [blue]파란 텍스트[/blue]";

    expect(normalizeContentPreview(preview)).toBe(
      "마크다운 테스트 현재 텍스트 강조 인용문 목록 파란 텍스트",
    );
  });

  it("내용이 없으면 fallback 문구를 반환한다", () => {
    expect(resolveContentPreview("   \n  ")).toBe(
      LIST_CONTENT_PREVIEW_FALLBACK,
    );
  });
});
