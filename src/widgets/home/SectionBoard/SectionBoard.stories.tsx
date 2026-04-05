import type { Meta, StoryObj } from "@storybook/react-vite";

import { SectionBoard } from "./SectionBoard";

import { mockFreePosts } from "@/mocks/freePosts";
import { mockInfoPosts } from "@/mocks/infoPosts";
import { mockQnAPosts } from "@/mocks/qnaPosts";

const meta = {
  title: "Widgets/Home/SectionBoard",
  component: SectionBoard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    onViewAll: { action: "clicked" },
  },
} satisfies Meta<typeof SectionBoard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const QnABoard: Story = {
  args: {
    title: "Q&A",
    posts: mockQnAPosts.slice(0, 5).map((post, index) => ({
      ...post,
      postId: index + 1,
    })),
  },
  decorators: [
    (Story) => (
      <div className="w-[894px]">
        <Story />
      </div>
    ),
  ],
};

export const InformationBoard: Story = {
  args: {
    title: "정보게시판",
    posts: mockInfoPosts.slice(0, 3).map((post, index) => ({
      ...post,
      postId: index + 101,
    })),
  },
  decorators: [
    (Story) => (
      <div className="w-[435px]">
        <Story />
      </div>
    ),
  ],
};

export const FreeBoard: Story = {
  args: {
    title: "자유게시판",
    posts: mockFreePosts.slice(0, 3).map((post, index) => ({
      ...post,
      postId: index + 201,
    })),
  },
  decorators: [
    (Story) => (
      <div className="w-[435px]">
        <Story />
      </div>
    ),
  ],
};
