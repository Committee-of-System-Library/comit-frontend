import type { Meta, StoryObj } from "@storybook/react-vite";

import { DetailButton } from "./DetailButton";

const meta = {
  title: "Shared/UI/DetailButton",
  component: DetailButton,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "게시글/댓글 상세보기(...) 버튼",
      },
    },
  },
  argTypes: {
    onClick: { action: "clicked" },
  },
} satisfies Meta<typeof DetailButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onClick: () => {},
  },
};
