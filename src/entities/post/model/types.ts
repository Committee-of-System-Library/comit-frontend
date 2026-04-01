export type BoardType = "EVENT" | "FREE" | "INFO" | "NOTICE" | "QNA";

export interface PostSummary {
  authorNickname: string;
  boardType: BoardType;
  commentCount: number;
  createdAt: string;
  id: number;
  likeCount: number;
  tags: string[];
  title: string;
}

export interface PostListResponse {
  hasNext: boolean;
  nextCursorId: number | null;
  posts: PostSummary[];
}

export interface PostDetail {
  authorNickname: string;
  boardType: BoardType;
  content: string;
  createdAt: string;
  id: number;
  likeCount: number;
  likedByMe: boolean;
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
  tags: string[];
  title: string;
}

export interface UpdatePostRequest {
  content: string;
  tags: string[];
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
