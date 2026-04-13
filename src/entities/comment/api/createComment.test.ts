import { describe, it, expect, vi } from "vitest";

import { createComment } from "./createComment";

import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

vi.mock("@/shared/api/client", () => ({
  apiClient: {
    post: vi.fn(),
  },
}));

describe("createComment API", () => {
  it("올바른 엔드포인트와 payload로 apiClient.post를 호출해야 한다", async () => {
    const mockPostId = 123;
    const mockPayload = { content: "테스트 댓글입니다." };
    const expectedEndpoint = API_ENDPOINTS.comment.byPost(mockPostId);

    await createComment(mockPostId, mockPayload);

    expect(apiClient.post).toHaveBeenCalledTimes(1);
    expect(apiClient.post).toHaveBeenCalledWith(
      expectedEndpoint,
      expect.objectContaining({
        body: mockPayload,
      }),
    );
  });
});
