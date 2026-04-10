import { describe, expect, it, vi } from "vitest";

import { togglePostLike } from "./togglePostLike";

import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

vi.mock("@/shared/api/client", () => ({
  apiClient: { post: vi.fn() },
}));

describe("togglePostLike API", () => {
  it("올바른 엔드포인트로 apiClient.post를 호출해야 한다", async () => {
    const mockPostId = 888;
    const expectedEndpoint = API_ENDPOINTS.post.like(mockPostId);

    await togglePostLike(mockPostId);

    expect(apiClient.post).toHaveBeenCalledTimes(1);

    expect(apiClient.post).toHaveBeenCalledWith(expectedEndpoint);
  });
});
