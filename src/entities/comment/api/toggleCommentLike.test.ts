import { describe, expect, it, vi } from "vitest";

import { toggleCommentLike } from "./toggleCommentLike";

import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

vi.mock("@/shared/api/client", () => ({
  apiClient: { post: vi.fn() },
}));

describe("toggleCommentLike API", () => {
  it("올바른 엔드포인트로 apiClient.post를 호출해야 한다", async () => {
    const mockCommentId = 101;
    const expectedEndpoint = API_ENDPOINTS.comment.like(mockCommentId);

    await toggleCommentLike(mockCommentId);

    expect(apiClient.post).toHaveBeenCalledTimes(1);

    expect(apiClient.post).toHaveBeenCalledWith(expectedEndpoint);
  });
});
