import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "./Button";

const meta = {
  title: "Foundations/Button",
  component: Button,
  tags: ["autodocs"],
  args: {
    children: "버튼",
    disabled: false,
    variant: "primary",
  },
  argTypes: {
    children: {
      control: "text",
    },
    variant: {
      control: "radio",
      options: ["primary", "secondary"],
    },
    onClick: {
      action: "clicked",
    },
  },
} satisfies Meta<typeof Button>;

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
    children: "아주 긴 텍스트 버튼 레이블 상태를 확인하기 위한 예시",
    variant: "secondary",
  },
};
