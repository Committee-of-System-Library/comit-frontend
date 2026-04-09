import { describe, expect, it, vi } from "vitest";

import { updateStudentNumberVisibility } from "./updateStudentNumberVisibility";

import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

vi.mock("@/shared/api/client", () => ({
  apiClient: { patch: vi.fn() },
}));

describe("updateStudentNumberVisibility", () => {
  it("PATCH /members/me/student-number-visibility 로 visible을 body에 담아 요청한다", async () => {
    await updateStudentNumberVisibility(true);

    expect(apiClient.patch).toHaveBeenCalledWith(
      API_ENDPOINTS.member.studentNumberVisibility,
      expect.objectContaining({
        body: { visible: true },
      }),
    );
  });
});
