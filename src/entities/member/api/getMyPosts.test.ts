import { describe, expect, it, vi } from "vitest";

import { getMyPosts } from "./getMyPosts";

import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

vi.mock("@/shared/api/client", () => ({
  apiClient: { get: vi.fn() },
}));

describe("getMyPosts", () => {
  it("GET /members/me/posts 로 요청한다", async () => {
    await getMyPosts();

    expect(apiClient.get).toHaveBeenCalledWith(
      API_ENDPOINTS.member.myPosts,
      expect.objectContaining({
        params: expect.objectContaining({ size: 10 }),
      }),
    );
  });

  it("cursor 파라미터를 함께 전달한다", async () => {
    await getMyPosts(5);

    expect(apiClient.get).toHaveBeenCalledWith(
      API_ENDPOINTS.member.myPosts,
      expect.objectContaining({
        params: expect.objectContaining({ cursor: 5 }),
      }),
    );
  });
});
