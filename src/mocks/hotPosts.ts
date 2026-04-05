export interface HotPost {
  id?: number;
  title: string;
  author: string;
  views: number | string;
  time: string;
}

export const mockHotPosts: HotPost[] = [
  {
    title: "제목",
    author: "사용자명",
    views: 1300,
    time: "2분 전",
  },
  {
    title: "어디게",
    author: "아는개산책",
    views: 850,
    time: "방금",
  },
  {
    title: "와이어프레임이 뭐에요?",
    author: "바보",
    views: 650,
    time: "방금",
  },
  {
    title: "밤 새야겠다",
    author: "음냐",
    views: 210,
    time: "2분 전",
  },
  {
    title: "새내기를 위한 노트북 추천",
    author: "사용자명",
    views: 1300,
    time: "5시간 전",
  },
];

export const edgeCaseHotPost: HotPost = {
  title:
    "이것은 매우 긴 제목입니다. 이것은 매우 긴 제목입니다. 이것은 매우 긴 제목입니다.",
  author: "매우긴이름의사용자",
  views: "999,999",
  time: "999년 전",
};
