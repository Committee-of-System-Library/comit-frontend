import type { Meta, StoryObj } from "@storybook/react-vite";

import { SignupStepBadge } from "./SignupStepBadge";

const meta = {
  title: "shared/ui/signup/SignupStepBadge",
  component: SignupStepBadge,
  tags: ["autodocs"],
  args: {
    active: false,
    step: 1,
  },
} satisfies Meta<typeof SignupStepBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Active: Story = {
  args: {
    active: true,
  },
};
