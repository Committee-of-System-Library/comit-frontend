export interface FreePost {
  title: string;
  content: string;
  author: string;
  likes: number;
  comments: number;
  time: string;
  imageUrl?: string;
}

export const mockFreePosts: FreePost[] = [
  {
    title: "자유게시판 테스트 제목 1",
    content: "자유게시판 테스트 내용입니다. 안녕하세요!",
    author: "자유인",
    likes: 12,
    comments: 4,
    time: "5분 전",
  },
  {
    title: "자유게시판 테스트 제목 2",
    content: "오늘 날씨가 정말 좋네요. 산책하기 딱 좋은 날씨입니다.",
    author: "산책러",
    likes: 8,
    comments: 2,
    time: "15분 전",
    imageUrl: "https://picsum.photos/400/300?random=1",
  },
  {
    title: "자유게시판 테스트 제목 3",
    content: "이번 주말에 다들 뭐 하시나요? 맛집 추천 부탁드려요.",
    author: "미식가",
    likes: 5,
    comments: 10,
    time: "30분 전",
  },
  {
    title: "자유게시판 테스트 제목 3",
    content: "이번 주말에 다들 뭐 하시나요? 맛집 추천 부탁드려요.",
    author: "미식가",
    likes: 5,
    comments: 10,
    time: "30분 전",
  },
  {
    title: "자유게시판 테스트 제목 3",
    content: "이번 주말에 다들 뭐 하시나요? 맛집 추천 부탁드려요.",
    author: "미식가",
    likes: 5,
    comments: 10,
    time: "30분 전",
  },
];
