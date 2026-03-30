import { type Author } from "@/types/author";

export type CommentVariant = "base" | "deleted" | "reply" | "deletedReply";

export interface CommentData extends Author {
  id: string;
  variant: CommentVariant;
  content: string;
  createdAt: string;
  isMine: boolean;
  isEdited?: boolean;
  replies?: CommentData[];
}
