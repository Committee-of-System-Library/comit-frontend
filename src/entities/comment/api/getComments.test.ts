import { describe, expect, it, vi } from "vitest";

import { getComments } from "./getComments";

import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

vi.mock("@/shared/api/client", () => ({
  apiClient: { get: vi.fn() },
}));

describe("getComments API", () => {
  it("올바른 엔드포인트로 apiClient.get을 호출해야 한다", async () => {
    const mockPostId = 789;
    const expectedEndpoint = API_ENDPOINTS.comment.byPost(mockPostId);

    await getComments(mockPostId);

    expect(apiClient.get).toHaveBeenCalledTimes(1);
    expect(apiClient.get).toHaveBeenCalledWith(expectedEndpoint);
  });
});
