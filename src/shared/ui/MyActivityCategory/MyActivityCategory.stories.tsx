import type { Meta, StoryObj } from "@storybook/react-vite";

import { MyActivityCategory } from "./MyActivityCategory";

const meta = {
  title: "Shared/UI/MyActivityCategory",
  component: MyActivityCategory,
  tags: ["autodocs"],
  argTypes: {
    onClick: { action: "clicked" },
  },
  args: {
    label: "내가 쓴 글",
    selected: false,
  },
} satisfies Meta<typeof MyActivityCategory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Selected: Story = {
  args: {
    selected: true,
  },
};

export const EdgeCase: Story = {
  args: {
    label: "이것은 엄청나게 긴 내 활동 카테고리입니다.",
    selected: true,
  },
};
