import type { Meta, StoryObj } from "@storybook/react-vite";

import { Pagination } from "./Pagination";

const meta: Meta<typeof Pagination> = {
  title: "Shared/UI/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  argTypes: {
    onPageChange: { action: "onPageChange" },
  },
  parameters: {
    docs: {
      description: {
        component: "페이지네이션(한번에 보여주는 최대 페이지 5개)",
      },
    },
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FirstGroup: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    pageGroupSize: 5,
  },
};

export const MiddleGroup: Story = {
  args: {
    currentPage: 7,
    totalPages: 15,
    pageGroupSize: 5,
  },
};

export const LastGroup: Story = {
  args: {
    currentPage: 13,
    totalPages: 13,
    pageGroupSize: 5,
  },
};

export const SingleGroup: Story = {
  args: {
    currentPage: 2,
    totalPages: 3,
    pageGroupSize: 5,
  },
};
