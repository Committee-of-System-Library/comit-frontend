import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { DefaultRightRail } from "./DefaultRightRail";

const mocks = vi.hoisted(() => ({
  usePostListQuery: vi.fn(({ boardType }: { boardType: string }) => ({
    data: {
      posts:
        boardType === "NOTICE"
          ? [
              {
                authorNickname: "관리자",
                boardType: "NOTICE",
                commentCount: 0,
                contentPreview: "",
                createdAt: "2026-03-10T00:00:00Z",
                id: 1,
                likeCount: 0,
                tags: [],
                title: "공지 제목",
              },
            ]
          : [
              {
                authorNickname: "운영진",
                boardType: "EVENT",
                commentCount: 0,
                contentPreview: "",
                createdAt: "2026-03-12T00:00:00Z",
                id: 2,
                likeCount: 0,
                tags: [],
                title: "이벤트 제목",
              },
            ],
    },
  })),
  navigate: vi.fn(),
  useHotPostsQuery: vi.fn(() => ({
    data: [
      {
        author: "사용자명",
        id: 3,
        time: "방금",
        title: "인기글 제목",
        views: 10,
      },
    ],
  })),
}));

vi.mock("react-router-dom", () => ({
  useNavigate: () => mocks.navigate,
}));

vi.mock("@/features/post/model/usePostListQuery", () => ({
  usePostListQuery: mocks.usePostListQuery,
}));

vi.mock("@/features/post/model/useHotPostsQuery", () => ({
  useHotPostsQuery: mocks.useHotPostsQuery,
}));

describe("DefaultRightRail", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders API-backed notice, event, and hot post sections", () => {
    const { getByRole, getByText } = render(<DefaultRightRail />);

    expect(getByRole("button", { name: "글 작성하기" })).toBeInTheDocument();
    expect(getByText("공지 제목")).toBeInTheDocument();
    expect(getByText("이벤트 제목")).toBeInTheDocument();
    expect(getByText("인기글 제목")).toBeInTheDocument();
    expect(mocks.usePostListQuery).toHaveBeenCalledTimes(2);
    expect(mocks.usePostListQuery).toHaveBeenNthCalledWith(1, {
      boardType: "NOTICE",
      enabled: true,
      size: 5,
    });
    expect(mocks.usePostListQuery).toHaveBeenNthCalledWith(2, {
      boardType: "EVENT",
      enabled: true,
      size: 5,
    });
  });
});
