import { useMutation } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useUpdateNicknameMutation } from "./useUpdateNicknameMutation";

import { updateNickname } from "@/entities/member/api/updateNickname";
import { queryKeys } from "@/shared/api/query-keys";

const { mockInvalidateQueries } = vi.hoisted(() => ({
  mockInvalidateQueries: vi.fn(),
}));

vi.mock("@tanstack/react-query", () => ({
  useMutation: vi.fn(),
  useQueryClient: vi.fn(() => ({ invalidateQueries: mockInvalidateQueries })),
}));

vi.mock("@/entities/member/api/updateNickname", () => ({
  updateNickname: vi.fn(),
}));

describe("useUpdateNicknameMutation", () => {
  it("mutationFn 실행 시 nickname을 updateNickname에 전달한다", async () => {
    vi.mocked(useMutation).mockReturnValue({} as never);

    renderHook(() => useUpdateNicknameMutation());

    const options = vi.mocked(useMutation).mock.calls[0][0];
    await (options.mutationFn as (nickname: string) => Promise<unknown>)(
      "새닉네임",
    );

    expect(updateNickname).toHaveBeenCalledWith({ nickname: "새닉네임" });
  });

  it("성공 시 member.me 쿼리를 invalidate한다", async () => {
    vi.mocked(useMutation).mockReturnValue({} as never);

    renderHook(() => useUpdateNicknameMutation());

    const options = vi.mocked(useMutation).mock.calls[0][0];
    await options.onSuccess?.(undefined, "", undefined, {} as never);

    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: queryKeys.member.me(),
    });
  });
});
