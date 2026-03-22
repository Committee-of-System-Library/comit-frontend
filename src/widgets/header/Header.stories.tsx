import type { Meta, StoryObj } from "@storybook/react-vite";

import { Header } from "./Header";

const meta = {
  title: "Layout/Header",
  component: Header,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isAuthenticated: true,
  },
};

export const Guest: Story = {
  args: {
    isAuthenticated: false,
  },
};

export const EdgeCase: Story = {
  args: {
    isAuthenticated: true,
    navItems: [
      { href: "/", isActive: true, label: "홈" },
      { href: "/board/qna", label: "Q&A" },
      { href: "/board/info", label: "정보게시판-아주긴메뉴명예시" },
      { href: "/board/free", label: "자유게시판" },
      { href: "/notice", label: "공지사항" },
      { href: "/event", label: "이벤트" },
    ],
  },
};
