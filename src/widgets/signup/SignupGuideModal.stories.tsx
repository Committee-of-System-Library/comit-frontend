import type { Meta, StoryObj } from "@storybook/react-vite";

import { SignupGuideModal } from "./SignupGuideModal";

const meta = {
  title: "widgets/signup/SignupGuideModal",
  component: SignupGuideModal,
  tags: ["autodocs"],
  args: {
    open: true,
    onClose: () => undefined,
  },
} satisfies Meta<typeof SignupGuideModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Eligible: Story = {
  args: {
    isCseStudent: true,
  },
};

export const EligibleStep2: Story = {
  args: {
    defaultStep: 2,
    isCseStudent: true,
  },
};
