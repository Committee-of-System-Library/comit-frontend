import { describe, expect, it, vi } from "vitest";

import { editComment } from "./editComment";

import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

vi.mock("@/shared/api/client", () => ({
  apiClient: { patch: vi.fn() },
}));

describe("editComment API", () => {
  it("올바른 엔드포인트와 payload로 apiClient.patch를 호출해야 한다", async () => {
    const mockCommentId = 456;
    const mockPayload = { content: "수정된 댓글 내용입니다." };
    const expectedEndpoint = API_ENDPOINTS.comment.detail(mockCommentId);

    await editComment(mockCommentId, mockPayload);

    expect(apiClient.patch).toHaveBeenCalledTimes(1);
    expect(apiClient.patch).toHaveBeenCalledWith(
      expectedEndpoint,
      expect.objectContaining({
        body: mockPayload,
      }),
    );
  });
});
