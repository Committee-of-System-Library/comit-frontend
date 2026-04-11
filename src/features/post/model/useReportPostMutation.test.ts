import { useMutation } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useReportPostMutation } from "./useReportPostMutation";

import { reportPost } from "@/entities/post/api/reportPost";
import type { ReportRequest } from "@/entities/post/model/types";

vi.mock("@tanstack/react-query", () => ({
  useMutation: vi.fn(),
}));

vi.mock("@/entities/post/api/reportPost", () => ({
  reportPost: vi.fn(),
}));

interface MockMutationOptions {
  mutationFn: (variables: {
    postId: number;
    payload: ReportRequest;
  }) => Promise<void>;
}

describe("useReportPostMutation", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useMutation).mockReturnValue({ mutate: vi.fn() } as never);
  });

  it("mutationFn 실행 시 reportPost API를 호출한다", async () => {
    renderHook(() => useReportPostMutation());

    const options = vi.mocked(useMutation).mock
      .calls[0][0] as unknown as MockMutationOptions;
    const mockParams = {
      postId: 456,
      payload: { message: "스팸 게시글입니다." },
    };

    await options.mutationFn(mockParams);

    expect(reportPost).toHaveBeenCalledTimes(1);
    expect(reportPost).toHaveBeenCalledWith(456, {
      message: "스팸 게시글입니다.",
    });
  });
});
