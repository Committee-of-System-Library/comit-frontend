import type { Meta, StoryObj } from "@storybook/react-vite";

import { WritingButton } from "./WritingButton";

const meta = {
  title: "Shared/UI/WritingButton",
  component: WritingButton,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "연필 아이콘 + 글 작성하기 버튼",
      },
    },
  },
} satisfies Meta<typeof WritingButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
