import type { Meta, StoryObj } from "@storybook/react-vite";

import { NoticePreviewItem } from "./NoticePreviewItem";

const meta = {
  title: "shared/ui/NoticePreviewItem",
  component: NoticePreviewItem,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof NoticePreviewItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "공지 제목",
    date: "2024.03.22",
  },
};

export const Disabled: Story = {
  args: {
    title: "비활성화된 공지 제목",
    date: "2024.03.22",
    className: "grayscale opacity-40 cursor-not-allowed pointer-events-none",
  },
};

export const EdgeCase: Story = {
  args: {
    title:
      "아주 아주 아주 아주 아주 아주 아주 아주 아주 아주 아주 아주 아주 아주 아주 아주 긴 공지 제목 테스트",
    date: "1년 전",
  },
};
