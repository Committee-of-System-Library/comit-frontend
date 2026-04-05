import { describe, expect, it } from "vitest";

import { applyOptimisticPostLikeUpdate } from "./postLikeCache";

import type {
  HotPostsResponse,
  PostDetail,
  PostListResponse,
} from "@/entities/post/model/types";

describe("applyOptimisticPostLikeUpdate", () => {
  it("updates a post detail cache optimistically", () => {
    const detail: PostDetail = {
      authorNickname: "author",
      boardType: "FREE",
      content: "content",
      createdAt: "2026-04-05T00:00:00Z",
      id: 7,
      imageUrls: [],
      likeCount: 3,
      likedByMe: false,
      tags: [],
      title: "title",
      updatedAt: null,
      viewCount: 10,
    };

    expect(applyOptimisticPostLikeUpdate(detail, 7, true)).toEqual({
      ...detail,
      likeCount: 4,
      likedByMe: true,
    });
  });

  it("updates post list caches without touching unrelated posts", () => {
    const list: PostListResponse = {
      hasNext: false,
      nextCursorId: null,
      posts: [
        {
          authorNickname: "author",
          boardType: "FREE",
          commentCount: 0,
          createdAt: "2026-04-05T00:00:00Z",
          id: 1,
          likeCount: 0,
          tags: [],
          title: "first",
        },
        {
          authorNickname: "author",
          boardType: "FREE",
          commentCount: 0,
          createdAt: "2026-04-05T00:00:00Z",
          id: 2,
          likeCount: 2,
          tags: [],
          title: "second",
        },
      ],
    };

    expect(applyOptimisticPostLikeUpdate(list, 2, false)).toEqual({
      ...list,
      posts: [
        list.posts[0],
        {
          ...list.posts[1],
          likeCount: 1,
        },
      ],
    });
  });

  it("updates hot post caches and clamps the like count at zero", () => {
    const hot: HotPostsResponse = {
      posts: [
        {
          authorNickname: "author",
          boardType: "FREE",
          commentCount: 0,
          createdAt: "2026-04-05T00:00:00Z",
          id: 5,
          likeCount: 1,
          rank: 1,
          tags: [],
          title: "hot",
        },
      ],
    };

    expect(applyOptimisticPostLikeUpdate(hot, 5, false)).toEqual({
      posts: [
        {
          ...hot.posts[0],
          likeCount: 0,
        },
      ],
    });
  });

  it("returns the original cache when the post is not present", () => {
    const list: PostListResponse = {
      hasNext: false,
      nextCursorId: null,
      posts: [],
    };

    expect(applyOptimisticPostLikeUpdate(list, 99, true)).toBe(list);
  });
});
