export interface MyProfile {
  id: number;
  nickname: string;
  studentNumber: string;
  studentNumberVisible: boolean;
}

export interface UpdateNicknameRequest {
  nickname: string;
}

export interface UpdateStudentNumberVisibilityRequest {
  visible: boolean;
}

export interface MyPost {
  postId: number;
  title: string;
  boardType: string;
  createdAt: string;
  content?: string;
  likeCount?: number;
  commentCount?: number;
}

export interface MyComment {
  commentId: number;
  content: string;
  postId: number;
  postTitle: string;
  createdAt: string;
  likeCount?: number;
  commentCount?: number;
}

export interface MyLike {
  postId: number;
  title: string;
  boardType: string;
  createdAt: string;
  content?: string;
  likeCount?: number;
  commentCount?: number;
}

export interface CursorPage<T> {
  totalCount: number;
  hasNext: boolean;
  nextCursor: number | null;
  items: T[];
}
