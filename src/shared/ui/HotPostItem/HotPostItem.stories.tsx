import type { Meta, StoryObj } from "@storybook/react-vite";

import { HotPostItem } from "./HotPostItem";

const meta = {
  title: "shared/ui/HotPostItem",
  component: HotPostItem,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof HotPostItem>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultArgs = {
  rank: 1,
  title: "인기 게시글 제목입니다",
  author: "사용자명",
  views: 1300,
  time: "방금",
};

export const Default: Story = {
  args: defaultArgs,
};

export const Disabled: Story = {
  args: {
    ...defaultArgs,
    className: "grayscale opacity-40 cursor-not-allowed pointer-events-none",
  },
  parameters: {
    a11y: {
      disable: true,
    },
  },
};

export const EdgeCase: Story = {
  args: {
    rank: 99,
    title:
      "매우 매우 매우 매우 매우 매우 매우 매우 매우 매우 매우 매우 긴 제목입니다",
    author: "매우긴이름의사용자명",
    views: "99.9k",
    time: "1년 전",
  },
};
