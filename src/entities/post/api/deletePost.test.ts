import { describe, expect, it, vi } from "vitest";

import { deletePost } from "./deletePost";

import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

vi.mock("@/shared/api/client", () => ({
  apiClient: { delete: vi.fn() },
}));

describe("deletePost API", () => {
  it("올바른 엔드포인트로 apiClient.delete를 호출해야 한다", async () => {
    const mockPostId = 1024;
    const expectedEndpoint = API_ENDPOINTS.post.delete(mockPostId);
    await deletePost(mockPostId);

    expect(apiClient.delete).toHaveBeenCalledTimes(1);

    expect(apiClient.delete).toHaveBeenCalledWith(expectedEndpoint);
  });
});
