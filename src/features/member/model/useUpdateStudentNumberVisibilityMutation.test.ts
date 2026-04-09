import { useMutation } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useUpdateStudentNumberVisibilityMutation } from "./useUpdateStudentNumberVisibilityMutation";

import { updateStudentNumberVisibility } from "@/entities/member/api/updateStudentNumberVisibility";
import { queryKeys } from "@/shared/api/query-keys";

const { mockInvalidateQueries } = vi.hoisted(() => ({
  mockInvalidateQueries: vi.fn(),
}));

vi.mock("@tanstack/react-query", () => ({
  useMutation: vi.fn(),
  useQueryClient: vi.fn(() => ({ invalidateQueries: mockInvalidateQueries })),
}));

vi.mock("@/entities/member/api/updateStudentNumberVisibility", () => ({
  updateStudentNumberVisibility: vi.fn(),
}));

describe("useUpdateStudentNumberVisibilityMutation", () => {
  it("mutationFn 실행 시 visible을 updateStudentNumberVisibility에 전달한다", async () => {
    vi.mocked(useMutation).mockReturnValue({} as never);

    renderHook(() => useUpdateStudentNumberVisibilityMutation());

    const options = vi.mocked(useMutation).mock.calls[0][0];
    await (options.mutationFn as (visible: boolean) => Promise<unknown>)(true);

    expect(updateStudentNumberVisibility).toHaveBeenCalledWith(true);
  });

  it("성공 시 member.me 쿼리를 invalidate한다", async () => {
    vi.mocked(useMutation).mockReturnValue({} as never);

    renderHook(() => useUpdateStudentNumberVisibilityMutation());

    const options = vi.mocked(useMutation).mock.calls[0][0];
    await options.onSuccess?.(undefined, true, undefined, {} as never);

    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: queryKeys.member.me(),
    });
  });
});
