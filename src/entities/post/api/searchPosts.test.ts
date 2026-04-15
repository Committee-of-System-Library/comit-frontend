import { beforeEach, describe, expect, it, vi } from "vitest";

import { searchPosts } from "./searchPosts";

import type { PostSearchQuery } from "@/entities/post/model/types";
import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

vi.mock("@/shared/api/client", () => ({
  apiClient: { get: vi.fn() },
}));

describe("searchPosts API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("필수 파라미터(keyword)만 있을 때 올바르게 apiClient.get을 호출해야 한다", async () => {
    const mockParams: PostSearchQuery = { keyword: "React" };

    await searchPosts(mockParams);

    expect(apiClient.get).toHaveBeenCalledTimes(1);
    expect(apiClient.get).toHaveBeenCalledWith(
      API_ENDPOINTS.post.search,
      expect.objectContaining({
        params: expect.objectContaining({
          keyword: "React",
          boardType: undefined,
          cursor: undefined,
          size: undefined,
        }),
      }),
    );
  });

  it("선택적 파라미터(boardType, cursor, size)가 함께 주어지면 모두 포함하여 호출해야 한다", async () => {
    const mockParams: PostSearchQuery = {
      keyword: "TypeScript",
      boardType: "FREE",
      cursor: 10,
      size: 20,
    };

    await searchPosts(mockParams);

    expect(apiClient.get).toHaveBeenCalledTimes(1);
    expect(apiClient.get).toHaveBeenCalledWith(
      API_ENDPOINTS.post.search,
      expect.objectContaining({
        params: expect.objectContaining({
          keyword: "TypeScript",
          boardType: "FREE",
          cursor: 10,
          size: 20,
        }),
      }),
    );
  });
});
