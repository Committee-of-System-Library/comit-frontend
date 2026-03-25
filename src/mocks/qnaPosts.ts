export interface QnAPost {
  title: string;
  content: string;
  author: string;
  likes: number;
  comments: number;
  time: string;
  imageUrl?: string;
}

export const mockQnAPosts: QnAPost[] = [
  {
    title: "Q&A 게시판 테스트 제목 1",
    content: "React 19에서 이 에러 어떻게 해결하나요?",
    author: "코린이",
    likes: 3,
    comments: 18,
    time: "2분 전",
  },
  {
    title: "Q&A 게시판 테스트 제목 2",
    content: "Tailwind CSS에서 동적 클래스 할당 질문입니다.",
    author: "퍼블리셔",
    likes: 5,
    comments: 7,
    time: "12분 전",
  },
  {
    title: "Q&A 게시판 테스트 제목 3",
    content: "VS Code 확장 프로그램 추천해 주실 분 있나요?",
    author: "개발자A",
    likes: 10,
    comments: 25,
    time: "45분 전",
    imageUrl: "https://picsum.photos/400/300?random=3",
  },
  {
    title: "Q&A 게시판 테스트 제목 2",
    content: "Tailwind CSS에서 동적 클래스 할당 질문입니다.",
    author: "퍼블리셔",
    likes: 5,
    comments: 7,
    time: "12분 전",
  },
  {
    title: "Q&A 게시판 테스트 제목 2",
    content: "Tailwind CSS에서 동적 클래스 할당 질문입니다.",
    author: "퍼블리셔",
    likes: 5,
    comments: 7,
    time: "12분 전",
  },
  {
    title: "Q&A 게시판 테스트 제목 2",
    content: "Tailwind CSS에서 동적 클래스 할당 질문입니다.",
    author: "퍼블리셔",
    likes: 5,
    comments: 7,
    time: "12분 전",
  },
];
