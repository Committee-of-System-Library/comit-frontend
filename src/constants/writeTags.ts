export const WRITE_POST_PRESET_TAGS = [
  "스터디",
  "동아리",
  "프로젝트",
  "취업준비",
  "일상",
  "개발",
  "목표달성",
] as const;

export type WritePostPresetTag = (typeof WRITE_POST_PRESET_TAGS)[number];
