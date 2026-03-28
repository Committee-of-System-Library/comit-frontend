import type { Meta, StoryObj } from "@storybook/react-vite";

import { SignupTextInput } from "./SignupTextInput";

const meta = {
  title: "shared/ui/signup/SignupTextInput",
  component: SignupTextInput,
  tags: ["autodocs"],
  args: {
    className: "max-w-[336px]",
    placeholder: "텍스트",
  },
} satisfies Meta<typeof SignupTextInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Active: Story = {
  args: {
    active: true,
    value: "텍스트",
  },
};

export const WithActionEmpty: Story = {
  args: {
    actionLabel: "중복 확인",
  },
};

export const WithActionFilled: Story = {
  args: {
    active: true,
    actionLabel: "중복 확인",
    value: "텍스트",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: "텍스트",
  },
};
