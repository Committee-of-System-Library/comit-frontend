import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "@storybook/test";

import { StudentNumberVisibilityToggle } from "./StudentNumberVisibilityToggle";

const meta = {
  title: "Shared/UI/StudentNumberVisibilityToggle",
  component: StudentNumberVisibilityToggle,
  tags: ["autodocs"],
  args: {
    onToggle: fn(),
  },
} satisfies Meta<typeof StudentNumberVisibilityToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    studentNumber: "2024123456",
    visible: false,
  },
};
