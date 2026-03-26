import type { Meta, StoryObj } from "@storybook/react-vite";

import { EventSideBoard } from "./EventSideBoard";

import { mockRecentEvents, edgeCaseEvent } from "@/mocks/recentEvents";

const meta = {
  title: "widgets/sideBoard/EventSideBoard",
  component: EventSideBoard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof EventSideBoard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    events: mockRecentEvents,
  },
};

export const Empty: Story = {
  args: {
    events: [],
  },
};

export const EdgeCase: Story = {
  args: {
    events: [edgeCaseEvent],
  },
};
