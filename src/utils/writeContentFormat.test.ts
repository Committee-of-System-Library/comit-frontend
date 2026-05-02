import { describe, expect, it } from "vitest";

import {
  applyBlockContentFormat,
  applyInlineContentFormat,
} from "@/utils/writeContentFormat";

describe("writeContentFormat", () => {
  it("같은 인라인 포맷을 다시 적용하면 토글 해제한다", () => {
    const result = applyInlineContentFormat({
      action: "red",
      placeholder: "빨간 텍스트",
      selectionEnd: 8,
      selectionStart: 5,
      value: "[red]텍스트[/red]",
    });

    expect(result.nextValue).toBe("텍스트");
    expect(result.selectionStart).toBe(0);
    expect(result.selectionEnd).toBe(3);
  });

  it("다른 인라인 포맷을 적용하면 기존 인라인 포맷을 교체한다", () => {
    const result = applyInlineContentFormat({
      action: "blue",
      placeholder: "파란 텍스트",
      selectionEnd: 8,
      selectionStart: 5,
      value: "[red]텍스트[/red]",
    });

    expect(result.nextValue).toBe("[blue]텍스트[/blue]");
  });

  it("블록 포맷이 포함된 선택 영역에 인라인 포맷을 적용하면 prefix는 유지한다", () => {
    const result = applyInlineContentFormat({
      action: "blue",
      placeholder: "파란 텍스트",
      selectionEnd: 7,
      selectionStart: 0,
      value: "## 제목",
    });

    expect(result.nextValue).toBe("## [blue]제목[/blue]");
  });

  it("같은 블록 포맷을 다시 적용하면 토글 해제한다", () => {
    const result = applyBlockContentFormat({
      action: "heading2",
      selectionEnd: 5,
      selectionStart: 0,
      value: "## 제목",
    });

    expect(result.nextValue).toBe("제목");
  });

  it("다른 블록 포맷을 적용하면 기존 block prefix를 교체한다", () => {
    const result = applyBlockContentFormat({
      action: "list",
      selectionEnd: 7,
      selectionStart: 0,
      value: "## 제목",
    });

    expect(result.nextValue).toBe("- 제목");
  });

  it("중복된 block prefix가 있으면 target prefix 하나만 남긴다", () => {
    const result = applyBlockContentFormat({
      action: "quote",
      selectionEnd: 11,
      selectionStart: 0,
      value: "## > - 제목",
    });

    expect(result.nextValue).toBe("> 제목");
  });
});
