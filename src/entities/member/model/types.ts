export interface MyProfile {
  id: number;
  nickname: string;
  studentNumber: string;
  studentNumberVisible: boolean;
  profileImageUrl: string | null;
  major?: string | null;
  majorTrack?: string | null;
  role: "ADMIN" | "STUDENT";
}

export interface UpdateProfileRequest {
  nickname?: string;
  profileImageUrl?: string | null;
}

export interface UpdateStudentNumberVisibilityRequest {
  visible: boolean;
}

export interface MyPost {
  id: number;
  title: string;
  boardType: string;
  contentPreview: string;
  authorNickname: string;
  likeCount: number;
  commentCount: number;
  tags: string[];
  imageUrls: string[];
  createdAt: string;
}

export interface MyComment {
  id: number;
  content: string;
  postId: number;
  postTitle: string;
  boardType: string;
  createdAt: string;
}

export interface MyLike {
  postId: number;
  postTitle: string;
  boardType: string;
  likedAt: string;
}

export interface CursorPage<T> {
  totalCount: number;
  hasNext: boolean;
  nextCursor: number | null;
  items: T[];
}

export interface MyPostSummary {
  id: number;
  title: string;
  createdAt: string;
}

export interface MyCommentSummary {
  id: number;
  content: string;
  postId: number;
  postTitle: string;
  boardType: string;
  createdAt: string;
}

export interface MyLikedPostSummary {
  postId: number;
  postTitle: string;
  boardType: string;
  likedAt: string;
}

export interface MyActivity {
  postCount: number;
  commentCount: number;
  likeCount: number;
  recentPosts: MyPostSummary[];
  recentComments: MyCommentSummary[];
  recentLikes: MyLikedPostSummary[];
}
