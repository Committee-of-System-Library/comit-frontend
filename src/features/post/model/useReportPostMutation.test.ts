import { useMutation } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useReportPostMutation } from "./useReportPostMutation";

import { reportPost } from "@/entities/post/api/reportPost";
import type {
  ReportRequest,
  ReportResponse,
} from "@/entities/post/model/types";

const { mockToastError, mockToastSuccess } = vi.hoisted(() => ({
  mockToastError: vi.fn(),
  mockToastSuccess: vi.fn(),
}));

vi.mock("@tanstack/react-query", () => ({
  useMutation: vi.fn(),
}));

vi.mock("react-hot-toast", () => ({
  toast: {
    success: mockToastSuccess,
    error: mockToastError,
  },
}));

vi.mock("@/entities/post/api/reportPost", () => ({
  reportPost: vi.fn(),
}));

describe("useReportPostMutation", () => {
  it("mutationFn 실행 시 postId와 payload를 reportPost에 전달한다", async () => {
    vi.mocked(useMutation).mockReturnValue({} as never);

    renderHook(() => useReportPostMutation());

    const options = vi.mocked(useMutation).mock.calls[0][0];
    await (
      options.mutationFn as (variables: {
        payload: ReportRequest;
        postId: number;
      }) => Promise<unknown>
    )({
      payload: { message: "스팸 게시글입니다." },
      postId: 7,
    });

    expect(reportPost).toHaveBeenCalledWith(7, {
      message: "스팸 게시글입니다.",
    });
  });

  it("onSuccess 실행 시 성공 토스트를 노출한다", async () => {
    vi.mocked(useMutation).mockReturnValue({} as never);

    renderHook(() => useReportPostMutation());

    const options = vi.mocked(useMutation).mock.calls[0][0];
    await options.onSuccess?.(
      { reportId: 1001 } as ReportResponse,
      { payload: { message: "신고" }, postId: 1 },
      undefined,
      {} as never,
    );

    expect(mockToastSuccess).toHaveBeenCalledWith(
      "신고가 정상적으로 접수되었습니다.",
    );
  });

  it("onError 실행 시 실패 토스트를 노출한다", async () => {
    vi.mocked(useMutation).mockReturnValue({} as never);

    renderHook(() => useReportPostMutation());

    const options = vi.mocked(useMutation).mock.calls[0][0];
    await options.onError?.(
      new Error("신고 실패"),
      { payload: { message: "신고" }, postId: 1 },
      undefined,
      {} as never,
    );

    expect(mockToastError).toHaveBeenCalledWith(
      "신고 처리 중 오류가 발생했습니다.",
    );
  });
});
