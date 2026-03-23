import type { Meta, StoryObj } from "@storybook/react-vite";

import { SearchLong } from "./SearchLong";

const meta: Meta<typeof SearchLong> = {
  title: "Shared/UI/SearchLong",
  component: SearchLong,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "게시판 검색창",
      },
    },
  },
  argTypes: {
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof SearchLong>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
