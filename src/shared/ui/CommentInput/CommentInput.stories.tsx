import type { Meta, StoryObj } from "@storybook/react-vite";

import { CommentInput } from "./CommentInput";

const meta: Meta<typeof CommentInput> = {
  title: "Shared/UI/CommentInput",
  component: CommentInput,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "댓글 입력창",
      },
    },
  },
  argTypes: {
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof CommentInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
