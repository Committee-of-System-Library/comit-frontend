export interface Comment {
  authorProfileImageUrl?: string | null;
  authorNickname: string;
  content: string;
  createdAt: string;
  likedByMe: boolean;
  likeCount: number;
  id: number;
  mine: boolean;
  profileImageUrl?: string | null;
  replies: Comment[];
  updatedAt: string | null;
}

export interface CreateCommentRequest {
  content: string;
  parentCommentId?: number;
}

export type CreateCommentResponse = number;

export interface EditCommentRequest {
  content: string;
}
export interface CommentListResponse {
  comments: Comment[];
}

export interface ReportRequest {
  message: string;
}

export interface ReportResponse {
  reportId: number;
}

export interface ToggleLikeResponse {
  helpful: boolean;
}
