export interface Comment {
  authorNickname: string;
  content: string;
  createdAt: string;
  helpfulByMe: boolean;
  helpfulCount: number;
  id: number;
  mine: boolean;
  replies: Comment[];
  updatedAt: string | null;
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

export interface ToggleHelpfulResponse {
  helpful: boolean;
}
