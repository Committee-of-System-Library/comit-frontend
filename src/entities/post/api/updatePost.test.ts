import { describe, expect, it, vi } from "vitest";

import { updatePost } from "./updatePost";

import type { UpdatePostRequest } from "@/entities/post/model/types";
import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

vi.mock("@/shared/api/client", () => ({
  apiClient: { patch: vi.fn() },
}));

describe("updatePost API", () => {
  it("올바른 엔드포인트와 payload로 apiClient.patch를 호출해야 한다", async () => {
    const mockPostId = 1004;

    const mockPayload: UpdatePostRequest = {
      title: "수정된 게시글 제목입니다",
      content: "내용도 이렇게 수정했습니다.",
      tags: ["수정", "테스트"],
    };
    const expectedEndpoint = API_ENDPOINTS.post.update(mockPostId);

    await updatePost(mockPostId, mockPayload);

    expect(apiClient.patch).toHaveBeenCalledTimes(1);
    expect(apiClient.patch).toHaveBeenCalledWith(
      expectedEndpoint,
      expect.objectContaining({
        body: mockPayload,
      }),
    );
  });
});
