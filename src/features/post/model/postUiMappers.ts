import type {
  HotPostSummary,
  PostDetail,
  PostSummary,
} from "@/entities/post/model/types";
import type { HotPost } from "@/mocks/hotPosts";
import type { RecentEvent } from "@/mocks/recentEvents";
import type { RecentNotice } from "@/mocks/recentNotices";
import type { Post } from "@/types/post";
import { resolveContentPreview } from "@/utils/contentPreview";
import { formatTimeAgo } from "@/utils/formatTime";

export interface BoardPostCardItem extends Post {
  id: number;
  postImage?: string[];
  tags?: string[];
  userImage?: string;
}

export interface SectionBoardPostItem {
  postId: number;
  author: string;
  comments: number;
  content: string;
  imageUrl?: string;
  likes: number;
  time: string;
  title: string;
}

const formatDateLabel = (dateString: string) => {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}.${month}.${day}`;
};

export const mapPostSummaryToBoardPostCardItem = (
  post: PostSummary,
): BoardPostCardItem => {
  return {
    comment: post.commentCount,
    content: resolveContentPreview(post.contentPreview),
    createdAt: post.createdAt,
    heart: post.likeCount,
    id: post.id,
    postImage: [],
    tags: post.tags,
    title: post.title,
    user: post.authorNickname,
    userImage: undefined,
  };
};

export const mapPostSummaryToSectionBoardPostItem = (
  post: PostSummary,
): SectionBoardPostItem => {
  return {
    postId: post.id,
    author: post.authorNickname,
    comments: post.commentCount,
    content: resolveContentPreview(post.contentPreview),
    imageUrl: undefined,
    likes: post.likeCount,
    time: formatTimeAgo(post.createdAt),
    title: post.title,
  };
};

export const mapPostSummaryToRecentNotice = (
  post: PostSummary,
): RecentNotice => {
  return {
    title: post.title,
    date: formatDateLabel(post.createdAt),
  };
};

export const mapPostSummaryToRecentEvent = (post: PostSummary): RecentEvent => {
  return {
    title: post.title,
    date: formatDateLabel(post.createdAt),
  };
};

export const mapHotPostSummaryToHotPost = (post: HotPostSummary): HotPost => {
  return {
    author: post.authorNickname,
    // hot post 응답에 viewCount가 없어 likeCount를 우선 노출합니다.
    views: post.likeCount,
    time: formatTimeAgo(post.createdAt),
    title: post.title,
  };
};

export const mapPostDetailToPost = (post: PostDetail): Post => {
  return {
    comment: 0,
    content: post.content,
    createdAt: formatTimeAgo(post.createdAt),
    heart: post.likeCount,
    image: post.imageUrls ?? [],
    tag: post.tags,
    title: post.title,
    user: post.authorNickname,
    view: post.viewCount,
  };
};
