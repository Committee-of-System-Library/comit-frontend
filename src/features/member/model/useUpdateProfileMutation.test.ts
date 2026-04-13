import { useMutation } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useUpdateProfileMutation } from "./useUpdateProfileMutation";

import { updateProfile } from "@/entities/member/api/updateProfile";
import { uploadImagesWithPresignedUrl } from "@/features/image/model/imageUpload";
import { queryKeys } from "@/shared/api/query-keys";

const { mockInvalidateQueries } = vi.hoisted(() => ({
  mockInvalidateQueries: vi.fn(),
}));

vi.mock("@tanstack/react-query", () => ({
  useMutation: vi.fn(),
  useQueryClient: vi.fn(() => ({ invalidateQueries: mockInvalidateQueries })),
}));

vi.mock("@/entities/member/api/updateProfile", () => ({
  updateProfile: vi.fn(),
}));

vi.mock("@/features/image/model/imageUpload", () => ({
  uploadImagesWithPresignedUrl: vi.fn(),
}));

describe("useUpdateProfileMutation", () => {
  it("이미지 파일 없이 nickname만 전달하면 updateProfile을 호출한다", async () => {
    vi.mocked(useMutation).mockReturnValue({} as never);

    renderHook(() => useUpdateProfileMutation());

    const options = vi.mocked(useMutation).mock.calls[0][0];
    await (options.mutationFn as (params: unknown) => Promise<unknown>)({
      nickname: "새닉네임",
    });

    expect(uploadImagesWithPresignedUrl).not.toHaveBeenCalled();
    expect(updateProfile).toHaveBeenCalledWith({
      nickname: "새닉네임",
      profileImageUrl: undefined,
    });
  });

  it("이미지 파일이 있으면 업로드 후 profileImageUrl을 함께 전달한다", async () => {
    vi.mocked(useMutation).mockReturnValue({} as never);
    vi.mocked(uploadImagesWithPresignedUrl).mockResolvedValue([
      "https://example.com/image.png",
    ]);

    renderHook(() => useUpdateProfileMutation());

    const options = vi.mocked(useMutation).mock.calls[0][0];
    const file = new File([""], "test.png", { type: "image/png" });
    await (options.mutationFn as (params: unknown) => Promise<unknown>)({
      nickname: "새닉네임",
      imageFile: file,
    });

    expect(uploadImagesWithPresignedUrl).toHaveBeenCalledWith(
      [file],
      "members",
    );
    expect(updateProfile).toHaveBeenCalledWith({
      nickname: "새닉네임",
      profileImageUrl: "https://example.com/image.png",
    });
  });

  it("성공 시 member.me 쿼리를 invalidate한다", async () => {
    vi.mocked(useMutation).mockReturnValue({} as never);

    renderHook(() => useUpdateProfileMutation());

    const options = vi.mocked(useMutation).mock.calls[0][0];
    await options.onSuccess?.(
      undefined,
      { nickname: "새닉네임" },
      undefined,
      {} as never,
    );

    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: queryKeys.member.me(),
    });
  });
});
