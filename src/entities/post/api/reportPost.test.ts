import { describe, expect, it, vi } from "vitest";

import { reportPost } from "./reportPost";

import type { ReportRequest } from "@/entities/post/model/types";
import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

vi.mock("@/shared/api/client", () => ({
  apiClient: { post: vi.fn() },
}));

describe("reportPost API", () => {
  it("올바른 엔드포인트와 payload로 apiClient.post를 호출해야 한다", async () => {
    const mockPostId = 777;

    const mockPayload: ReportRequest = {
      message: "부적절한 내용이 포함되어 있습니다.",
    };
    const expectedEndpoint = API_ENDPOINTS.post.report(mockPostId);

    await reportPost(mockPostId, mockPayload);

    expect(apiClient.post).toHaveBeenCalledTimes(1);
    expect(apiClient.post).toHaveBeenCalledWith(
      expectedEndpoint,
      expect.objectContaining({
        body: mockPayload,
      }),
    );
  });
});
