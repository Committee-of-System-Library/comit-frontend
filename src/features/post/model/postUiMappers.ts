import type {
  HotPostSummary,
  PostDetail,
  PostSummary,
} from "@/entities/post/model/types";
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

export interface RightRailNoticeItem {
  id: number;
  title: string;
  date: string;
}

export interface RightRailEventItem {
  id: number;
  title: string;
  date: string;
}

export interface RightRailHotPostItem {
  id: number;
  author: string;
  views: number;
  time: string;
  title: string;
}

const resolveAuthorProfileImageUrl = (item: {
  author?: { profileImageUrl?: string | null } | null;
  authorProfileImageUrl?: string | null;
  profileImageUrl?: string | null;
}) =>
  item.authorProfileImageUrl ??
  item.profileImageUrl ??
  item.author?.profileImageUrl ??
  undefined;

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
    userImage: resolveAuthorProfileImageUrl(post),
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
): RightRailNoticeItem => {
  return {
    id: post.id,
    title: post.title,
    date: formatDateLabel(post.createdAt),
  };
};

export const mapPostSummaryToRecentEvent = (
  post: PostSummary,
): RightRailEventItem => {
  return {
    id: post.id,
    title: post.title,
    date: formatDateLabel(post.createdAt),
  };
};

export const mapHotPostSummaryToHotPost = (
  post: HotPostSummary,
): RightRailHotPostItem => {
  return {
    id: post.id,
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
    likedByMe: post.likedByMe,
    tag: post.tags,
    title: post.title,
    user: post.authorNickname,
    userImage: resolveAuthorProfileImageUrl(post),
    view: post.viewCount,
  };
};
