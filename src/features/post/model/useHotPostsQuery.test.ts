import { useQuery } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useHotPostsQuery } from "./useHotPostsQuery";

import { queryKeys } from "@/shared/api/query-keys";

vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn(),
}));

describe("useHotPostsQuery", () => {
  it("applies longer cache timing and maps hot posts for the right rail", () => {
    const useQueryMock = vi.mocked(useQuery);
    useQueryMock.mockReturnValue({ data: undefined } as never);

    renderHook(() => useHotPostsQuery());

    expect(useQueryMock).toHaveBeenCalledWith(
      expect.objectContaining({
        enabled: true,
        gcTime: 30 * 60 * 1000,
        queryKey: queryKeys.post.hot(),
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
      }),
    );

    const options = useQueryMock.mock.calls[0][0];
    const mapped = options.select?.({
      posts: [
        {
          authorNickname: "작성자",
          boardType: "NOTICE",
          commentCount: 0,
          contentPreview: null,
          createdAt: "2026-04-05T00:00:00Z",
          id: 1,
          likeCount: 42,
          rank: 1,
          tags: [],
          title: "핫 게시글",
        },
      ],
    });

    expect(mapped).toEqual([
      expect.objectContaining({
        author: "작성자",
        title: "핫 게시글",
      }),
    ]);
  });
});
