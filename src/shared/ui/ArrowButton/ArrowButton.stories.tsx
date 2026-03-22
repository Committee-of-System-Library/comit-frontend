import type { Meta, StoryObj } from "@storybook/react-vite";

import { ArrowButton } from "./ArrowButton";

const meta = {
  title: "shared/ui/ArrowButton",
  component: ArrowButton,
  decorators: [
    (Story) => (
      <div className="flex h-40 w-40 items-center justify-center bg-white rounded-lg">
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ArrowButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    direction: "right",
  },
};

export const Left: Story = {
  args: {
    direction: "left",
  },
};

export const Disabled: Story = {
  args: {
    direction: "left",
    disabled: true,
  },
  parameters: {
    a11y: {
      disable: true,
    },
  },
};

export const EdgeCase: Story = {
  args: {
    direction: "right",
    className: "scale-150",
  },
};
