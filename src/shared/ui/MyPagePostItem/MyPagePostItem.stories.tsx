import type { Meta, StoryObj } from "@storybook/react-vite";

import { MyPagePostItem } from "./MyPagePostItem";

const meta = {
  title: "Shared/UI/MyPagePostItem",
  component: MyPagePostItem,
  tags: ["autodocs"],
  argTypes: {
    onClick: { action: "clicked" },
  },
} satisfies Meta<typeof MyPagePostItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "내가 쓴 게시글 제목이 여기에 표시됩니다.",
    createdAt: "2026.03.28",
  },
};

export const EdgeCase: Story = {
  args: {
    title:
      "매우 긴 제목의 게시글입니다. 제목이 길어지면 말줄임표 처리가 되어야 하며 우측의 날짜 영역을 침범하지 않아야 합니다.",
    createdAt: "2026.03.28",
  },
};
