import type { Meta, StoryObj } from "@storybook/react-vite";

import { BoardTag } from "./BoardTag";

const meta = {
  title: "shared/ui/BoardTag",
  component: BoardTag,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
  },
} satisfies Meta<typeof BoardTag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "게시판 이름",
  },
};

export const Disabled: Story = {
  args: {
    label: "비활성 게시판",
    className: "opacity-50 grayscale cursor-not-allowed",
  },
};

export const EdgeCase: Story = {
  args: {
    label: "매우긴게시판이름이들어갔을때의레이아웃테스트용텍스트",
  },
};

export const QA: Story = {
  args: {
    label: "Q&A",
  },
};

export const Info: Story = {
  args: {
    label: "정보",
  },
};

export const Free: Story = {
  args: {
    label: "자유",
  },
};
