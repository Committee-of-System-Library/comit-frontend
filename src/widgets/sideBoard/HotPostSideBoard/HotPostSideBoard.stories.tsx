import type { Meta, StoryObj } from "@storybook/react-vite";

import { HotPostSideBoard } from "./HotPostSideBoard";

import { mockHotPosts, edgeCaseHotPost } from "@/mocks/hotPosts";

const meta: Meta<typeof HotPostSideBoard> = {
  title: "Widgets/SideBoard/HotPostSideBoard",
  component: HotPostSideBoard,
  tags: ["autodocs"],
  argTypes: {
    posts: {
      control: "object",
    },
  },
};

export default meta;
type Story = StoryObj<typeof HotPostSideBoard>;

export const Default: Story = {
  args: {
    posts: mockHotPosts,
  },
};

export const Disabled: Story = {
  args: {
    posts: [],
  },
};

export const EdgeCase: Story = {
  args: {
    posts: [edgeCaseHotPost],
  },
};
