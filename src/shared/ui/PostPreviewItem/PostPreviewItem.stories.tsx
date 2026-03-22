import type { Meta, StoryObj } from "@storybook/react-vite";

import { PostPreviewItem } from "./PostPreviewItem";

const meta = {
  title: "shared/ui/PostPreviewItem",
  component: PostPreviewItem,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    imageUrl: { control: "text" },
  },
} satisfies Meta<typeof PostPreviewItem>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultArgs = {
  title: "글 제목",
  content:
    "글 세부 내용이 여기에 들어갑니다. 두 줄 이상일 경우 말줄임표 처리가 되는지 확인하세요.",
  author: "사용자",
  likes: "하트 개수",
  comments: "댓글 개수",
  time: "올린 시간",
};

export const Default: Story = {
  args: {
    ...defaultArgs,
    imageUrl: "https://placehold.co/400",
  },
};

export const WithoutImage: Story = {
  args: {
    ...defaultArgs,
    imageUrl: undefined,
  },
};

export const Disabled: Story = {
  args: {
    ...defaultArgs,
    className: "grayscale opacity-40 cursor-not-allowed pointer-events-none",
  },
  parameters: {
    a11y: {
      disable: true,
    },
  },
};

export const EdgeCase: Story = {
  args: {
    title:
      "아주 아주 아주 아주 아주 아주 아주 아주 아주 아주 아주 아주 긴 글 제목 테스트",
    content:
      "아주 아주 아주 아주 아주 아주 아주 아주 아주 아주 아주 아주 아주 아주 아주 아주 아주 아주 아주 아주 아주 아주 아주 아주 긴 글 내용 테스트 테스트 테스트",
    author: "매우긴이름의사용자",
    likes: 9999,
    comments: 9999,
    time: "1년 전",
    imageUrl: "https://placehold.co/400",
  },
};
