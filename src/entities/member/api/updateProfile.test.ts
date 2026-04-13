import { describe, expect, it, vi } from "vitest";

import { updateProfile } from "./updateProfile";

import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

vi.mock("@/shared/api/client", () => ({
  apiClient: { patch: vi.fn() },
}));

describe("updateProfile", () => {
  it("PATCH /members/me 로 nickname을 body에 담아 요청한다", async () => {
    await updateProfile({ nickname: "새닉네임" });

    expect(apiClient.patch).toHaveBeenCalledWith(
      API_ENDPOINTS.member.me,
      expect.objectContaining({
        body: { nickname: "새닉네임" },
      }),
    );
  });

  it("PATCH /members/me 로 profileImageUrl을 body에 담아 요청한다", async () => {
    await updateProfile({ profileImageUrl: "https://example.com/image.png" });

    expect(apiClient.patch).toHaveBeenCalledWith(
      API_ENDPOINTS.member.me,
      expect.objectContaining({
        body: { profileImageUrl: "https://example.com/image.png" },
      }),
    );
  });
});
