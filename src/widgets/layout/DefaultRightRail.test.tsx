import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { DefaultRightRail } from "./DefaultRightRail";

import { mockHotPosts } from "@/mocks/hotPosts";
import { mockRecentEvents } from "@/mocks/recentEvents";
import { mockRecentNotices } from "@/mocks/recentNotices";

const mocks = vi.hoisted(() => ({
  useCachedBoardPostList: vi.fn(() => ({ data: undefined })),
  navigate: vi.fn(),
  useHotPostsQuery: vi.fn(() => ({ data: undefined })),
}));

vi.mock("react-router-dom", () => ({
  useNavigate: () => mocks.navigate,
}));

vi.mock("@/features/post/model/useCachedBoardPostList", () => ({
  useCachedBoardPostList: mocks.useCachedBoardPostList,
}));

vi.mock("@/features/post/model/useHotPostsQuery", () => ({
  useHotPostsQuery: mocks.useHotPostsQuery,
}));

describe("DefaultRightRail", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders fallback content without issuing NOTICE or EVENT list requests", () => {
    const { getByRole, getByText } = render(<DefaultRightRail />);

    expect(getByRole("button", { name: "글 작성하기" })).toBeInTheDocument();
    expect(getByText(mockRecentNotices[0].title)).toBeInTheDocument();
    expect(getByText(mockRecentEvents[0].title)).toBeInTheDocument();
    expect(getByText(mockHotPosts[0].title)).toBeInTheDocument();
    expect(mocks.useCachedBoardPostList).toHaveBeenCalledTimes(2);
    expect(mocks.useCachedBoardPostList).toHaveBeenNthCalledWith(1, {
      boardType: "NOTICE",
      size: 100,
    });
    expect(mocks.useCachedBoardPostList).toHaveBeenNthCalledWith(2, {
      boardType: "EVENT",
      size: 100,
    });
  });
});
