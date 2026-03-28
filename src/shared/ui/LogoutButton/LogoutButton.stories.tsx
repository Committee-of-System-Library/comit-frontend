import type { Meta, StoryObj } from "@storybook/react-vite";

import { LogoutButton } from "./LogoutButton";

const meta = {
  title: "Shared/UI/LogoutButton",
  component: LogoutButton,
  tags: ["autodocs"],
  argTypes: {
    onClick: { action: "clicked" },
  },
} satisfies Meta<typeof LogoutButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
