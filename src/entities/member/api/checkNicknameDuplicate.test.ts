import { describe, expect, it, vi } from "vitest";

import { checkNicknameDuplicate } from "./checkNicknameDuplicate";

import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

vi.mock("@/shared/api/client", () => ({
  apiClient: { get: vi.fn() },
}));

describe("checkNicknameDuplicate", () => {
  it("GET /members/nicknames/check 에 value 쿼리로 요청한다", async () => {
    await checkNicknameDuplicate({ value: "comit-user" });

    expect(apiClient.get).toHaveBeenCalledWith(
      API_ENDPOINTS.member.nicknameCheck,
      {
        params: { value: "comit-user" },
      },
    );
  });
});
