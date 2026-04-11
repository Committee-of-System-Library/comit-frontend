import { describe, expect, it, vi } from "vitest";

import { reportComment } from "./reportComment";

import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

vi.mock("@/shared/api/client", () => ({
  apiClient: { post: vi.fn() },
}));

describe("reportComment API", () => {
  it("올바른 엔드포인트와 payload로 apiClient.post를 호출해야 한다", async () => {
    const mockCommentId = 999;
    const mockPayload = { message: "스팸 및 홍보성 댓글입니다." };
    const expectedEndpoint = API_ENDPOINTS.comment.report(mockCommentId);

    await reportComment(mockCommentId, mockPayload);

    expect(apiClient.post).toHaveBeenCalledTimes(1);
    expect(apiClient.post).toHaveBeenCalledWith(
      expectedEndpoint,
      expect.objectContaining({
        body: mockPayload,
      }),
    );
  });
});
