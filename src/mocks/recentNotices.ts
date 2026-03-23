export interface RecentNotice {
  title: string;
  date: string;
}

export const mockRecentNotices: RecentNotice[] = [
  {
    title: "[필독] 커뮤니티 이용 가이드라인 업데이트",
    date: "2026.03.10",
  },
  {
    title: "DevHub 해커톤 2026 참가자 모집 시작",
    date: "2026.03.08",
  },
  {
    title: "스팸·홍보 게시글 신고 기능 추가",
    date: "2026.03.05",
  },
];

export const edgeCaseNotice: RecentNotice = {
  title:
    "매우 긴 제목의 공지사항 테스트입니다. 과연 말줄임표가 제대로 적용될까요? 확인해보세요. 매우 긴 제목의 공지사항 테스트입니다.",
  date: "2026.01.01",
};
