import type { Meta, StoryObj } from "@storybook/react-vite";
import { FileText, MessageCircleMore, Heart } from "lucide-react";

import { MyActivitySectionBoard } from "./MyActivitySectionBoard";

const meta = {
  title: "Widgets/mypage/MyActivitySectionBoard",
  component: MyActivitySectionBoard,
  tags: ["autodocs"],
  args: {
    title: "내가 쓴 글",
    count: 32,
    icon: <FileText size={18} />,
    items: [
      {
        id: 1,
        title: "이번 학기 컴퓨터 네트워크 과제 너무 어렵네요ㅠㅠ",
        createdAt: "2026.03.20",
      },
      {
        id: 2,
        title: "알고리즘 스터디 모집합니다 (백준 실버 이상)",
        createdAt: "2026.03.18",
      },
      {
        id: 3,
        title: "학생회관 식당 오늘 메뉴 대박입니다",
        createdAt: "2026.03.15",
      },
      {
        id: 4,
        title: "C++ 문법 질문있습니다. 포인터가 이해가 안 가요.",
        createdAt: "2026.03.12",
      },
      { id: 5, title: "다들 시험 공부 화이팅하세요!", createdAt: "2026.03.10" },
    ],
  },
} satisfies Meta<typeof MyActivitySectionBoard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const MyComments: Story = {
  args: {
    title: "내가 쓴 댓글",
    count: 2,
    icon: <MessageCircleMore size={18} />,
    items: [
      {
        id: 1,
        title: "저도 그 과제 하느라 밤샜어요...",
        createdAt: "2026.03.20",
      },
      { id: 2, title: "좋은 정보 감사합니다!", createdAt: "2026.03.19" },
    ],
  },
};

export const Liked: Story = {
  args: {
    title: "좋아요",
    count: 1,
    icon: <Heart size={18} />,
    items: [
      {
        id: 1,
        title: "공지사항: 2026학년도 신입생 환영회 안내",
        createdAt: "2026.03.10",
      },
    ],
  },
};

export const Empty: Story = {
  args: {
    title: "내가 쓴 댓글",
    count: 0,
    items: [],
    icon: <MessageCircleMore size={18} />,
  },
};
