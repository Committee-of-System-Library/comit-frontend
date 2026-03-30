import type { Meta, StoryObj } from "@storybook/react-vite";

import { HeartButton } from "./HeartButton";

const meta = {
  title: "Shared/UI/HeartButton",
  component: HeartButton,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "좋아요 버튼. liked / unLiked 상태 존재",
      },
    },
  },
} satisfies Meta<typeof HeartButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LikedState: Story = {
  args: {
    variant: "liked",
    count: 10,
  },
};

export const UnLikedState: Story = {
  args: {
    variant: "unLiked",
    count: 3,
  },
};

export const Disabled: Story = {
  args: {
    variant: "unLiked",
    disabled: true,
    count: 0,
  },
};
