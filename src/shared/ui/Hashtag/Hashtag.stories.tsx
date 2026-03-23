import type { Meta, StoryObj } from "@storybook/react-vite";

import { Hashtag } from "./Hashtag";

const meta = {
  title: "shared/ui/Hashtag",
  component: Hashtag,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    type: {
      control: "radio",
      options: ["default", "add", "exclude"],
    },
  },
} satisfies Meta<typeof Hashtag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "해시태그",
    type: "default",
  },
};

export const Add: Story = {
  args: {
    label: "해시태그",
    type: "add",
  },
};

export const Exclude: Story = {
  args: {
    label: "해시태그",
    type: "exclude",
  },
};

export const Disabled: Story = {
  args: {
    label: "비활성 해시태그",
    className: "opacity-50 grayscale cursor-not-allowed",
  },
};

export const EdgeCase: Story = {
  args: {
    label: "매우긴해시태그텍스트입력테스트용데이터",
  },
};
