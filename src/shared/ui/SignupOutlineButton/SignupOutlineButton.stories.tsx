import type { Meta, StoryObj } from "@storybook/react-vite";

import { SignupOutlineButton } from "./SignupOutlineButton";

const meta = {
  title: "shared/ui/signup/SignupOutlineButton",
  component: SignupOutlineButton,
  tags: ["autodocs"],
  args: {
    children: "중복 확인",
    disabled: false,
  },
} satisfies Meta<typeof SignupOutlineButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
