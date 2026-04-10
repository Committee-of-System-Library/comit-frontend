import { describe, expect, it, vi } from "vitest";

import { createPost } from "./createPost";

import type { CreatePostRequest } from "@/entities/post/model/types";
import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

vi.mock("@/shared/api/client", () => ({
  apiClient: { post: vi.fn() },
}));

describe("createPost API", () => {
  it("올바른 엔드포인트와 payload로 apiClient.post를 호출해야 한다", async () => {
    const mockPayload: CreatePostRequest = {
      boardType: "FREE",
      title: "프론트엔드 단위 테스트 질문있습니다",
      content: "Vitest 환경설정 어떻게 하시나요?",
      tags: ["테스트", "프론트엔드"],
    };

    const expectedEndpoint = API_ENDPOINTS.post.base;

    await createPost(mockPayload);

    expect(apiClient.post).toHaveBeenCalledTimes(1);
    expect(apiClient.post).toHaveBeenCalledWith(
      expectedEndpoint,
      expect.objectContaining({
        body: mockPayload,
      }),
    );
  });
});
