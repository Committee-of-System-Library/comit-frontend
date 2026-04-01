import type { Meta, StoryObj } from "@storybook/react-vite";

import { ShareButton } from "./ShareButton";

const meta = {
  title: "Shared/UI/ShareButton",
  component: ShareButton,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "공유하기 버튼입니다. default/url 상태 전환, url 클립보드에 복사 가능",
      },
    },
  },
} satisfies Meta<typeof ShareButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: "default",
    url: "https://github.com/Committee-of-System-Library/knu-cse-comit-client",
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    variant: "default",
    url: "https://github.com/Committee-of-System-Library/knu-cse-comit-client",
    disabled: true,
  },
};
