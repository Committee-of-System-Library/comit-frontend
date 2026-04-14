import { describe, expect, it, vi } from "vitest";

import type {
  HotPostSummary,
  PostDetail,
  PostSummary,
} from "@/entities/post/model/types";
import {
  mapHotPostSummaryToHotPost,
  mapPostDetailToPost,
  mapPostSummaryToBoardPostCardItem,
  mapPostSummaryToRecentEvent,
  mapPostSummaryToRecentNotice,
  mapPostSummaryToSectionBoardPostItem,
} from "@/features/post/model/postUiMappers"; // 실제 파일명으로 수정해주세요 (예: postMappers.ts)
import { resolveContentPreview } from "@/utils/contentPreview";
import { formatTimeAgo } from "@/utils/formatTime";

// 외부 유틸 함수 모킹
vi.mock("@/utils/contentPreview", () => ({
  resolveContentPreview: vi.fn((content) => content ?? "기본_미리보기"),
}));

vi.mock("@/utils/formatTime", () => ({
  formatTimeAgo: vi.fn(() => "방금 전"),
}));

describe("Post Mappers", () => {
  const mockPostSummary: PostSummary = {
    id: 1,
    authorNickname: "테스트유저",
    boardType: "FREE",
    commentCount: 5,
    contentPreview: "미리보기 내용",
    createdAt: "2023-10-25T10:00:00Z",
    likeCount: 10,
    tags: ["태그1", "태그2"],
    title: "테스트 제목",
  };

  it("mapPostSummaryToBoardPostCardItem: PostSummary를 BoardPostCardItem으로 변환한다", () => {
    const result = mapPostSummaryToBoardPostCardItem(mockPostSummary);

    expect(result).toEqual({
      id: 1,
      title: "테스트 제목",
      content: "미리보기 내용", // resolveContentPreview 결과
      user: "테스트유저",
      comment: 5,
      heart: 10,
      createdAt: "2023-10-25T10:00:00Z",
      postImage: [],
      tags: ["태그1", "태그2"],
      userImage: undefined,
    });
    expect(resolveContentPreview).toHaveBeenCalledWith("미리보기 내용");
  });

  it("mapPostSummaryToSectionBoardPostItem: PostSummary를 SectionBoardPostItem으로 변환한다", () => {
    const result = mapPostSummaryToSectionBoardPostItem(mockPostSummary);

    expect(result).toEqual({
      postId: 1,
      title: "테스트 제목",
      content: "미리보기 내용",
      author: "테스트유저",
      comments: 5,
      likes: 10,
      time: "방금 전", // formatTimeAgo 결과
      imageUrl: undefined,
    });
    expect(formatTimeAgo).toHaveBeenCalledWith("2023-10-25T10:00:00Z");
  });

  describe("formatDateLabel 관련 맵퍼 테스트 (RecentNotice, RecentEvent)", () => {
    it("정상적인 날짜 문자열을 YYYY.MM.DD 형식으로 변환한다", () => {
      const result = mapPostSummaryToRecentNotice(mockPostSummary);

      expect(result).toEqual({
        id: 1,
        title: "테스트 제목",
        date: "2023.10.25", // 내부 formatDateLabel 변환 결과
      });
    });

    it("유효하지 않은 날짜 문자열이 들어오면 원본 문자열을 그대로 반환한다", () => {
      const invalidPostSummary = {
        ...mockPostSummary,
        createdAt: "잘못된_날짜",
      };
      const result = mapPostSummaryToRecentEvent(invalidPostSummary);

      expect(result.date).toBe("잘못된_날짜");
    });
  });

  it("mapHotPostSummaryToHotPost: HotPostSummary를 HotPost로 변환한다", () => {
    const mockHotPostSummary: HotPostSummary = {
      ...mockPostSummary,
      rank: 1,
    };

    const result = mapHotPostSummaryToHotPost(mockHotPostSummary);

    expect(result).toEqual({
      id: 1,
      title: "테스트 제목",
      author: "테스트유저",
      views: 10, // likeCount가 views로 매핑됨
      time: "방금 전",
    });
  });

  it("mapPostDetailToPost: PostDetail을 Post로 변환한다", () => {
    const mockPostDetail: PostDetail = {
      id: 99,
      authorNickname: "작성자",
      boardType: "INFO",
      content: "본문 내용",
      createdAt: "2023-10-25T10:00:00Z",
      updatedAt: null,
      likeCount: 50,
      likedByMe: true,
      tags: ["정보"],
      title: "정보글",
      viewCount: 100,
      imageUrls: ["image1.png"],
    };

    const result = mapPostDetailToPost(mockPostDetail);

    expect(result).toEqual({
      title: "정보글",
      content: "본문 내용",
      user: "작성자",
      userImage: undefined,
      heart: 50,
      likedByMe: true,
      comment: 0,
      createdAt: "방금 전",
      view: 100,
      image: ["image1.png"],
      tag: ["정보"],
    });
  });
});
