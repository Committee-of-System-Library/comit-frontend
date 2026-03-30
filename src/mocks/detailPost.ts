import type { CommentData } from "@/types/comment";

export const MOCK_POST_DATA = {
  id: 101,
  user: "비밀번호틀림",
  userImage: "https://picsum.photos/seed/author/100/100",
  title: "글쓰기 싫어요",
  content: "그만쓰게해주세요",
  image: [
    "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1485955900006-10f4d324d445?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop",
  ],
  tag: ["해시태그", "해시태그", "해시태그"],
  createdAt: "2026.03.22 15:58",
  view: 100,
  heart: 12,
  comment: 5,
  isMine: true,
};

export const MOCK_COMMENTS: CommentData[] = [
  {
    id: "1",
    name: "닉네임",
    variant: "base",
    content: "음음음",
    createdAt: "2026.03.22 15:58",
    isMine: true,
    replies: [
      {
        id: "11",
        name: "대댓글러1",
        variant: "reply",
        content: "음음음",
        createdAt: "2026.03.22 15:58",
        isMine: false,
      },
    ],
  },
  {
    id: "2",
    name: "닉네임",
    variant: "base",
    content: "음음음",
    createdAt: "2026.03.22 15:58",
    isMine: false,
    replies: [
      {
        id: "21",
        name: "대댓글러2",
        variant: "reply",
        content: "음음음",
        createdAt: "2026.03.22 15:58",
        isMine: false,
      },
      {
        id: "22",
        name: "대댓글러3",
        variant: "reply",
        content: "음음음",
        createdAt: "2026.03.21 15:58",
        isMine: false,
      },
    ],
  },
  {
    id: "3",
    name: "삭제된댓글",
    variant: "deleted",
    content: "삭제된 댓글입니다",
    createdAt: "2026.03.22 15:58",
    isMine: false,
    replies: [],
  },
];
