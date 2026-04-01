import type { Meta, StoryObj } from "@storybook/react-vite";

import { SignupMascotBubble } from "./SignupMascotBubble";

const meta = {
  title: "shared/ui/signup/SignupMascotBubble",
  component: SignupMascotBubble,
  tags: ["autodocs"],
  args: {
    text: "꿱🐥",
  },
} satisfies Meta<typeof SignupMascotBubble>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
