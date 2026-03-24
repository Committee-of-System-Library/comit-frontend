import type { Post } from "@/types/post";

export interface MockPostData extends Post {
  id: number;
  userImage?: string;
  postImage?: string[];
  tags?: string[];
}

export const MOCK_QNA_POSTS: MockPostData[] = [
  {
    id: 1,
    title: "리액트에서 useEffect 의존성 배열 질문입니다.",
    content:
      "useEffect 안에서 상태를 업데이트하는데 무한 루프에 빠집니다. 어떻게 해결해야 할까요?",
    user: "초보개발자",
    heart: 12,
    comment: 5,
    createdAt: "2026-03-24T10:00:00Z",
    tags: ["React", "Hooks"],
  },
  {
    id: 2,
    title: "테일윈드 CSS 적용이 안 되는 문제가 있습니다 ㅠㅠ",
    content:
      "설정 파일도 다 맞게 한 것 같은데 특정 클래스만 안 먹힙니다. 사진 첨부합니다.",
    user: "프론트엔드지망생",
    heart: 3,
    comment: 2,
    createdAt: "2026-03-23T15:30:00Z",
    postImage: [
      "https://picsum.photos/seed/tw1/200/200",
      "https://picsum.photos/seed/tw2/200/200",
    ],
    tags: ["Tailwind", "CSS"],
    userImage: "https://picsum.photos/seed/user1/50/50",
  },
  {
    id: 3,
    title: "타입스크립트 제네릭 너무 어려워요",
    content:
      "제네릭을 써서 공통 컴포넌트를 만들고 싶은데 타입 에러가 계속 납니다.",
    user: "TS마스터하고싶다",
    heart: 8,
    comment: 10,
    createdAt: "2026-03-22T09:15:00Z",
    tags: ["TypeScript"],
  },
  {
    id: 4,
    title: "Vite 빌드 속도 최적화 팁 공유합니다.",
    content:
      "플러그인 몇 개만 설정해줘도 빌드 속도가 체감될 정도로 빨라지네요.",
    user: "성능최적화장인",
    heart: 45,
    comment: 12,
    createdAt: "2026-03-21T14:20:00Z",
    postImage: ["https://picsum.photos/seed/vite/200/200"],
    tags: ["Vite", "Build"],
  },
  {
    id: 5,
    title: "라우팅 설정 질문",
    content: "react-router-dom v6 사용 중입니다.",
    user: "라우터",
    heart: 2,
    comment: 1,
    createdAt: "2026-03-20T10:00:00Z",
  },
  {
    id: 6,
    title: "상태 관리 라이브러리 추천해주세요",
    content: "Zustand랑 Recoil 중에 고민입니다.",
    user: "결정장애",
    heart: 15,
    comment: 8,
    createdAt: "2026-03-19T10:00:00Z",
    tags: ["Zustand"],
  },
  {
    id: 7,
    title: "CORS 에러 백엔드 탓인가요?",
    content: "로컬에서 API 호출하는데 자꾸 CORS가 뜹니다.",
    user: "백엔드나와라",
    heart: 5,
    comment: 3,
    createdAt: "2026-03-18T10:00:00Z",
  },
  {
    id: 8,
    title: "취준생 포트폴리오 리뷰 부탁드립니다",
    content: "이번에 만든 개인 프로젝트입니다.",
    user: "취준생",
    heart: 30,
    comment: 22,
    createdAt: "2026-03-17T10:00:00Z",
    postImage: ["https://picsum.photos/seed/port/200/200"],
  },
  {
    id: 9,
    title: "비동기 처리 로직 질문",
    content: "Promise.all을 언제 써야 효율적일까요?",
    user: "비동기",
    heart: 7,
    comment: 4,
    createdAt: "2026-03-16T10:00:00Z",
  },
  {
    id: 10,
    title: "다크모드 구현 아이디어",
    content: "테일윈드로 다크모드 구현하는 제일 깔끔한 방법",
    user: "다크나이트",
    heart: 18,
    comment: 6,
    createdAt: "2026-03-15T10:00:00Z",
    tags: ["Tailwind", "UI"],
  },
  {
    id: 11,
    title: "11번째 게시글 (2페이지 테스트용)",
    content: "이 글은 2페이지에 보여야 합니다.",
    user: "테스터",
    heart: 1,
    comment: 0,
    createdAt: "2026-03-14T10:00:00Z",
  },
  {
    id: 12,
    title: "12번째 게시글 (2페이지 테스트용)",
    content: "이 글도 2페이지에 보여야 합니다.",
    user: "테스터2",
    heart: 0,
    comment: 0,
    createdAt: "2026-03-13T10:00:00Z",
  },
];
