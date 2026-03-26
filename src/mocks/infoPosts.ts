export interface InfoPost {
  title: string;
  content: string;
  author: string;
  likes: number;
  comments: number;
  time: string;
  imageUrl?: string;
}

export const mockInfoPosts: InfoPost[] = [
  {
    title: "정보게시판 테스트 제목 1",
    content: "컴공생이라면 반드시 알아야 할 꿀팁 대방출!",
    author: "정보왕",
    likes: 25,
    comments: 12,
    time: "10분 전",
  },
  {
    title: "정보게시판 테스트 제목 2",
    content: "2026년 상반기 IT 채용 트렌드 분석 리포트입니다.",
    author: "커리어빌더",
    likes: 42,
    comments: 15,
    time: "1시간 전",
    imageUrl: "https://picsum.photos/400/300?random=2",
  },
  {
    title: "정보게시판 테스트 제목 3",
    content: "신입 개발자를 위한 기술 면접 대비 체크리스트",
    author: "멘토K",
    likes: 30,
    comments: 8,
    time: "3시간 전",
  },
];
