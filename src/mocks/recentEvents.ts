export interface RecentEvent {
  title: string;
  date: string;
}

export const mockRecentEvents: RecentEvent[] = [
  {
    title: "[모집] 2026 GDG KNU 스프린트 참가자 모집",
    date: "2026.03.15",
  },
  {
    title: "AI 기반 프로젝트 아이디어톤 참가 안내",
    date: "2026.03.12",
  },
  {
    title: "프론트엔드 집중 스터디 OT 진행 안내",
    date: "2026.03.09",
  },
];

export const edgeCaseEvent: RecentEvent = {
  title:
    "매우 긴 제목의 이벤트 카드 테스트입니다. 과연 말줄임표가 제대로 적용될까요? 확인해보세요. 매우 긴 제목의 이벤트 카드 테스트입니다.",
  date: "2026.01.01",
};
