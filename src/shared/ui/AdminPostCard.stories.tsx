import type { Meta, StoryObj } from "@storybook/react-vite";

import { AdminPostCard } from "./AdminPostCard";

const meta = {
  title: "Shared/UI/AdminPostCard",
  component: AdminPostCard,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "이벤트/공지사항 게시글 전용 포스트카드",
      },
    },
  },
  args: {
    title: "공지사항 테스트 제목입니다.",
    content:
      "관리자 카드 레이아웃이 잘 나오는지 확인하기 위한 테스트 본문 내용입니다.",
    user: "한나영",
    heart: 12,
    comment: 5,
    createdAt: new Date().toISOString(), // 현재 시간 기준
    disabled: false,
  },
} satisfies Meta<typeof AdminPostCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const EdgeCase: Story = {
  args: {
    title:
      "아주아주아주 긴 제목이 들어왔을 때 카드가 터지지 않고 말줄임표 처리가 잘 되는지 확인하기 위한 테스트용 긴 제목",
    content:
      "본문 내용도 마찬가지로 세 줄 이상 넘어갈 정도로 길게 작성했을 때 line-clamp 속성이 적용되어 레이아웃을 해치지 않는지 테스트합니다. 가나다라마바사 아자차카타파하! 가나다라마바사 아자차카타파하! 가나다라마바사 아자차카타파하!.",
    heart: 999,
    comment: 150,
    createdAt: "2024-01-01T00:00:00Z", // 아주 오래전 시간 테스트
  },
};
