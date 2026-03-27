import type { Meta, StoryObj } from "@storybook/react-vite";

import { OptionItem } from "./OptionItem";

const meta = {
  title: "Shared/UI/OptionItem",
  component: OptionItem,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "report: 신고 / delete: 삭제 / edit: 편집 버튼",
      },
    },
  },
} satisfies Meta<typeof OptionItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ReportState: Story = {
  args: {
    variant: "report",
  },
};

export const DeleteState: Story = {
  args: {
    variant: "delete",
  },
};

export const EditState: Story = {
  args: {
    variant: "edit",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
