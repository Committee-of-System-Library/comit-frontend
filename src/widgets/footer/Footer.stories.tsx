import type { Meta, StoryObj } from "@storybook/react-vite";

import { Footer } from "./Footer";

const meta = {
  title: "Layout/Footer",
  component: Footer,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const EdgeCase: Story = {
  args: {
    serviceLinks: [
      { href: "/terms", label: "이용약관" },
      {
        href: "/privacy",
        label: "개인정보처리방침(업데이트 예정 긴 문구 예시)",
      },
      { href: "/contact", label: "문의하기" },
    ],
  },
};
