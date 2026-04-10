import { describe, expect, it, vi } from "vitest";

import { deleteComment } from "./deleteComment";

import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

vi.mock("@/shared/api/client", () => ({
  apiClient: { delete: vi.fn() },
}));

describe("deleteComment API", () => {
  it("올바른 엔드포인트로 apiClient.delete를 호출해야 한다", async () => {
    const mockCommentId = 123;
    const expectedEndpoint = API_ENDPOINTS.comment.detail(mockCommentId);

    await deleteComment(mockCommentId);

    expect(apiClient.delete).toHaveBeenCalledTimes(1);
    expect(apiClient.delete).toHaveBeenCalledWith(expectedEndpoint);
  });
});
