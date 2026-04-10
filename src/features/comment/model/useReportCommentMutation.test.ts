import { useMutation } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { toast } from "react-hot-toast";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useReportCommentMutation } from "./useReportCommentMutation";

import { reportComment } from "@/entities/comment/api/reportComment";
import type {
  ReportRequest,
  ReportResponse,
} from "@/entities/comment/model/types";

vi.mock("@tanstack/react-query", () => ({
  useMutation: vi.fn(),
}));

vi.mock("react-hot-toast", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@/entities/comment/api/reportComment", () => ({
  reportComment: vi.fn(),
}));

interface MockMutationOptions {
  mutationFn: (variables: {
    commentId: number;
    payload: ReportRequest;
  }) => Promise<ReportResponse>;
  onSuccess: (
    data: ReportResponse,
    variables: { commentId: number; payload: ReportRequest },
    context: unknown,
  ) => void;
  onError: (
    error: Error,
    variables: { commentId: number; payload: ReportRequest },
    context: unknown,
  ) => void;
}

describe("useReportCommentMutation", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useMutation).mockReturnValue({ mutate: vi.fn() } as never);
  });

  it("mutationFn 실행 시 reportComment API를 호출한다", async () => {
    renderHook(() => useReportCommentMutation());

    const options = vi.mocked(useMutation).mock
      .calls[0][0] as unknown as MockMutationOptions;
    const mockParams = {
      commentId: 101,
      payload: { message: "부적절한 댓글입니다." },
    };

    await options.mutationFn(mockParams);

    expect(reportComment).toHaveBeenCalledTimes(1);
    expect(reportComment).toHaveBeenCalledWith(101, {
      message: "부적절한 댓글입니다.",
    });
  });

  it("onSuccess 시 성공 토스트를 띄운다", () => {
    renderHook(() => useReportCommentMutation());

    const options = vi.mocked(useMutation).mock
      .calls[0][0] as unknown as MockMutationOptions;
    const mockResponse: ReportResponse = { reportId: 999 };
    const mockVariables = {
      commentId: 101,
      payload: { message: "부적절한 댓글입니다." },
    };

    options.onSuccess(mockResponse, mockVariables, undefined);

    expect(toast.success).toHaveBeenCalledWith(
      "신고가 정상적으로 접수되었습니다.",
    );
  });

  it("onError 시 에러 토스트를 띄운다", () => {
    renderHook(() => useReportCommentMutation());

    const options = vi.mocked(useMutation).mock
      .calls[0][0] as unknown as MockMutationOptions;
    const mockVariables = {
      commentId: 101,
      payload: { message: "부적절한 댓글입니다." },
    };

    options.onError(new Error("Test Error"), mockVariables, undefined);

    expect(toast.error).toHaveBeenCalledWith(
      "신고 처리 중 오류가 발생했습니다.",
    );
  });
});
