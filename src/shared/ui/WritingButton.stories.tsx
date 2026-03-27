import type { Meta, StoryObj } from "@storybook/react-vite";

import { WritingButton } from "./WritingButton";

const meta = {
  title: "Shared/UI/WritingButton",
  component: WritingButton,
  tags: ["autodocs"],
  args: {
    children: "글 작성하기",
    disabled: false,
    fullWidth: true,
    variant: "writing",
  },
  argTypes: {
    variant: {
      control: "radio",
      options: ["writing", "action"],
    },
    onClick: {
      action: "clicked",
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "아이콘 포함/미포함을 props로 제어하는 범용 쓰기 버튼 컴포넌트",
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

export const WriteActionStyle: Story = {
  args: {
    children: "작성 완료",
    icon: null,
    variant: "action",
  },
};

export const HoveringState: Story = {
  args: {
    children: "작성 완료",
    icon: null,
    variant: "action",
  },
};
