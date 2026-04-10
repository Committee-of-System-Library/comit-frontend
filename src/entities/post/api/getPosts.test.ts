import { beforeEach, describe, expect, it, vi } from "vitest";

import { getPosts } from "./getPosts";

import type { PostListQuery } from "@/entities/post/model/types";
import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

vi.mock("@/shared/api/client", () => ({
  apiClient: { get: vi.fn() },
}));

describe("getPosts API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("필수 파라미터(boardType)만 있을 때 올바르게 apiClient.get을 호출해야 한다", async () => {
    const mockParams: PostListQuery = { boardType: "FREE" };
    const expectedEndpoint = API_ENDPOINTS.post.base;

    await getPosts(mockParams);

    expect(apiClient.get).toHaveBeenCalledTimes(1);
    expect(apiClient.get).toHaveBeenCalledWith(
      expectedEndpoint,
      expect.objectContaining({
        params: expect.objectContaining({
          boardType: "FREE",
          cursor: undefined,
          size: undefined,
        }),
      }),
    );
  });

  it("선택적 파라미터(cursor, size)가 함께 주어지면 모두 포함하여 호출해야 한다", async () => {
    const mockParams: PostListQuery = {
      boardType: "EVENT",
      cursor: 15,
      size: 20,
    };
    const expectedEndpoint = API_ENDPOINTS.post.base;

    await getPosts(mockParams);

    expect(apiClient.get).toHaveBeenCalledTimes(1);
    expect(apiClient.get).toHaveBeenCalledWith(
      expectedEndpoint,
      expect.objectContaining({
        params: expect.objectContaining({
          boardType: "EVENT",
          cursor: 15,
          size: 20,
        }),
      }),
    );
  });
});
