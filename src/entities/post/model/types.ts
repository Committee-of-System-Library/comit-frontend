export type BoardType = "EVENT" | "FREE" | "INFO" | "NOTICE" | "QNA";

export interface PostSummary {
  authorProfileImageUrl?: string | null;
  authorNickname: string;
  boardType: BoardType;
  commentCount: number;
  contentPreview?: string | null;
  createdAt: string;
  id: number;
  imageUrls?: string[];
  likeCount: number;
  profileImageUrl?: string | null;
  tags: string[];
  title: string;
}

export interface HotPostSummary extends PostSummary {
  rank: number;
}

export interface HotPostsResponse {
  posts: HotPostSummary[];
}

export interface PostListResponse {
  hasNext: boolean;
  nextCursorId: number | null;
  posts: PostSummary[];
}

export interface PostDetail {
  authorProfileImageUrl?: string | null;
  authorNickname: string;
  boardType: BoardType;
  content: string;
  createdAt: string;
  id: number;
  imageUrls?: string[];
  likeCount: number;
  likedByMe: boolean;
  profileImageUrl?: string | null;
  tags: string[];
  title: string;
  updatedAt: string | null;
  viewCount: number;
}

export interface PostListQuery {
  boardType: BoardType;
  cursor?: number;
  size?: number;
}

export interface CreatePostRequest {
  boardType: BoardType;
  content: string;
  imageUrls?: string[];
  tags?: string[];
  title: string;
}

export interface UpdatePostRequest {
  content: string;
  imageUrls?: string[];
  tags?: string[] | null;
  title: string;
}

export interface ReportRequest {
  message: string;
}

export interface ReportResponse {
  reportId: number;
}

export interface ToggleLikeResponse {
  liked: boolean;
}

export interface PostSearchQuery {
  keyword: string;
  boardType?: BoardType;
  cursor?: number;
  size?: number;
}

export interface PostSearchResponse {
  totalCount: number;
  hasNext: boolean;
  nextCursorId: number | null;
  posts: PostSummary[];
}
