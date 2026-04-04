export type MemberStatus = "ACTIVE" | "SUSPENDED" | "BANNED";
export type BoardType = "QNA" | "FREE";
export type ReportTargetType = "POST" | "COMMENT";
export type ReportStatus = "RECEIVED" | "REVIEWED" | "DISMISSED" | "ACTIONED";

export interface AdminMemberSummary {
  createdAt: string;
  id: number;
  nickname: string;
  status: MemberStatus;
  studentNumber: string;
  suspendedUntil: string | null;
}

export interface AdminMemberPageResponse {
  members: AdminMemberSummary[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface AdminMemberStatusPayload {
  status: MemberStatus;
  suspendedUntil?: string | null;
}

export interface AdminPostSummary {
  authorNickname: string;
  boardType: BoardType;
  createdAt: string;
  contentPreview?: string | null;
  hiddenByAdmin: boolean;
  id: number;
  likeCount: number;
  title: string;
  viewCount: number;
}

export interface AdminPostPageResponse {
  page: number;
  posts: AdminPostSummary[];
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface AdminVisibilityPayload {
  hidden: boolean;
}

export interface AdminCommentSummary {
  authorNickname: string;
  content: string;
  createdAt: string;
  helpfulCount: number;
  hiddenByAdmin: boolean;
  id: number;
  parentCommentId: number | null;
  postId: number;
}

export interface AdminCommentPageResponse {
  comments: AdminCommentSummary[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface AdminReportSummary {
  createdAt: string;
  id: number;
  message: string;
  reporterNickname: string;
  status: ReportStatus;
  targetId: number;
  targetType: ReportTargetType;
}

export interface AdminReportPageResponse {
  page: number;
  reports: AdminReportSummary[];
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface AdminReportDetail {
  createdAt: string;
  id: number;
  message: string;
  reporterNickname: string;
  reviewedAt: string | null;
  reviewedByNickname: string | null;
  status: ReportStatus;
  targetId: number;
  targetType: ReportTargetType;
}

export interface ReviewReportPayload {
  status: ReportStatus;
}

export interface AdminListParams {
  page?: number;
  size?: number;
}
