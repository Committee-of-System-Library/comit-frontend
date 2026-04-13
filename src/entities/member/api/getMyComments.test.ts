import { describe, expect, it, vi } from "vitest";

import { getMyComments } from "./getMyComments";

import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

vi.mock("@/shared/api/client", () => ({
  apiClient: {
    get: vi
      .fn()
      .mockResolvedValue({ comments: [], nextCursorId: null, hasNext: false }),
  },
}));

describe("getMyComments", () => {
  it("GET /members/me/comments 로 요청한다", async () => {
    await getMyComments();

    expect(apiClient.get).toHaveBeenCalledWith(
      API_ENDPOINTS.member.myComments,
      expect.objectContaining({
        params: expect.objectContaining({ size: 10 }),
      }),
    );
  });

  it("cursor 파라미터를 함께 전달한다", async () => {
    await getMyComments(5);

    expect(apiClient.get).toHaveBeenCalledWith(
      API_ENDPOINTS.member.myComments,
      expect.objectContaining({
        params: expect.objectContaining({ cursor: 5 }),
      }),
    );
  });
});
