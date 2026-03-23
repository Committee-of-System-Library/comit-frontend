import type { Meta, StoryObj } from "@storybook/react-vite";

import { NoticeSideBoard } from "./NoticeSideBoard";

import { mockRecentNotices, edgeCaseNotice } from "@/mocks/recentNotices";

const meta = {
  title: "widgets/sideBoard/NoticeSideBoard",
  component: NoticeSideBoard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof NoticeSideBoard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    notices: mockRecentNotices,
  },
};

export const Empty: Story = {
  args: {
    notices: [],
  },
};

export const EdgeCase: Story = {
  args: {
    notices: [edgeCaseNotice],
  },
};
