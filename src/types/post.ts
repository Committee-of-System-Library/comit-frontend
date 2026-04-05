export interface Post {
  title: string;
  content: string;
  user: string;
  heart: number;
  likedByMe?: boolean;
  comment: number;
  createdAt: string;
  view?: number;
  image?: string[];
  tag?: string[];
}
