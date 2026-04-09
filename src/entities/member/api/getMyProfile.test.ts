import { describe, expect, it, vi } from "vitest";

import { getMyProfile } from "./getMyProfile";

import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

vi.mock("@/shared/api/client", () => ({
  apiClient: { get: vi.fn() },
}));

describe("getMyProfile", () => {
  it("GET /members/me 로 요청한다", async () => {
    await getMyProfile();

    expect(apiClient.get).toHaveBeenCalledWith(API_ENDPOINTS.member.me);
  });
});
