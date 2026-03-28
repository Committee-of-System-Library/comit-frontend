import type { Meta, StoryObj } from "@storybook/react-vite";

import { ProfileWidget } from "./ProfileWidget";

const meta = {
  title: "Widgets/mypage/ProfileWidget",
  component: ProfileWidget,
  tags: ["autodocs"],
  args: {
    initialUserName: "김컴잇",
    major: "컴퓨터학부",
    studentId: "24학번",
    imgURL: null,
  },
} satisfies Meta<typeof ProfileWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithImage: Story = {
  args: {
    imgURL: "https://github.com/shadcn.png",
  },
};
