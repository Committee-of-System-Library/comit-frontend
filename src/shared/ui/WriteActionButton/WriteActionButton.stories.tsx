import type { Meta, StoryObj } from "@storybook/react-vite";

import { WriteActionButton } from "./WriteActionButton";

const meta = {
  title: "shared/ui/WriteActionButton",
  component: WriteActionButton,
  tags: ["autodocs"],
  args: {
    children: "작성 완료",
    variant: "default",
    disabled: false,
  },
  argTypes: {
    variant: {
      control: "radio",
      options: ["default", "dark"],
    },
    onClick: {
      action: "clicked",
    },
  },
} satisfies Meta<typeof WriteActionButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const EdgeCase: Story = {
  args: {
    children: "아주 긴 버튼 텍스트 레이블 상태 확인",
    variant: "dark",
  },
};
