import { describe, expect, it, vi } from "vitest";

import { getMyLikes } from "./getMyLikes";

import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

vi.mock("@/shared/api/client", () => ({
  apiClient: { get: vi.fn() },
}));

describe("getMyLikes", () => {
  it("GET /members/me/likes 로 요청한다", async () => {
    await getMyLikes();

    expect(apiClient.get).toHaveBeenCalledWith(
      API_ENDPOINTS.member.myLikes,
      expect.objectContaining({
        params: expect.objectContaining({ size: 10 }),
      }),
    );
  });

  it("cursor 파라미터를 함께 전달한다", async () => {
    await getMyLikes(5);

    expect(apiClient.get).toHaveBeenCalledWith(
      API_ENDPOINTS.member.myLikes,
      expect.objectContaining({
        params: expect.objectContaining({ cursor: 5 }),
      }),
    );
  });
});
