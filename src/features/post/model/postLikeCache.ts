import type {
  HotPostsResponse,
  PostDetail,
  PostListResponse,
  PostSummary,
} from "@/entities/post/model/types";

export type PostLikeCacheData =
  | PostDetail
  | PostListResponse
  | HotPostsResponse;

const clampLikeCount = (likeCount: number, delta: number) => {
  return Math.max(0, likeCount + delta);
};

const updatePostSummaryLikeCount = <T extends PostSummary>(
  post: T,
  delta: number,
): T => {
  return {
    ...post,
    likeCount: clampLikeCount(post.likeCount, delta),
  };
};

const updatePostCollectionLikeCount = <
  T extends PostSummary,
  R extends {
    posts: T[];
  },
>(
  data: R,
  postId: number,
  delta: number,
): R => {
  let updated = false;
  const posts = data.posts.map((post) => {
    if (post.id !== postId) {
      return post;
    }

    updated = true;
    return updatePostSummaryLikeCount(post, delta);
  });

  return updated ? { ...data, posts } : data;
};

export const applyOptimisticPostLikeUpdate = (
  data: PostLikeCacheData | undefined,
  postId: number,
  nextLiked: boolean,
): PostLikeCacheData | undefined => {
  if (!data) {
    return data;
  }

  const delta = nextLiked ? 1 : -1;

  if ("likedByMe" in data) {
    if (data.id !== postId) {
      return data;
    }

    return {
      ...data,
      likeCount: clampLikeCount(data.likeCount, delta),
      likedByMe: nextLiked,
    };
  }

  if (!("posts" in data)) {
    return data;
  }

  return updatePostCollectionLikeCount(data, postId, delta);
};
