import { describe, expect, it, vi } from "vitest";

import { getPostDetail } from "./getPostDetail";

import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

vi.mock("@/shared/api/client", () => ({
  apiClient: { get: vi.fn() },
}));

describe("getPostDetail API", () => {
  it("올바른 엔드포인트로 apiClient.get을 호출해야 한다", async () => {
    const mockPostId = 42;
    const expectedEndpoint = API_ENDPOINTS.post.detail(mockPostId);

    await getPostDetail(mockPostId);

    expect(apiClient.get).toHaveBeenCalledTimes(1);

    expect(apiClient.get).toHaveBeenCalledWith(expectedEndpoint);
  });
});
