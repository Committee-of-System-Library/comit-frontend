import type { Meta, StoryObj } from "@storybook/react-vite";

import { PostCard } from "./PostCard";

const meta = {
  title: "Shared/UI/PostCard",
  component: PostCard,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "사용자 게시글 전용 포스트카드",
      },
    },
  },
  args: {
    title: "게시글 테스트 제목입니다.",
    content:
      "이미지와 태그 레이아웃이 잘 나오는지 확인하기 위한 테스트 본문 내용입니다.",
    user: "한나영",
    heart: 12,
    comment: 5,
    createdAt: new Date().toISOString(),
    disabled: false,
    userImage: "https://picsum.photos/100",
    postImage: [
      "https://picsum.photos/id/10/200/200",
      "https://picsum.photos/id/20/200/200",
    ],
    tags: ["공지", "이벤트"],
  },
} satisfies Meta<typeof PostCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const EdgeCase: Story = {
  args: {
    title: "이미지와 태그가 아주 많을 때 레이아웃이 터지지 않는지 확인합니다.",
    content:
      "포스트 이미지와 해시태그가 박스 너비를 넘어갈 경우, 오른쪽 그라데이션 마스크 처리가 자연스럽게 되는지 확인하기 위한 케이스입니다.",
    postImage: [
      "https://picsum.photos/id/30/200/200",
      "https://picsum.photos/id/40/200/200",
      "https://picsum.photos/id/50/200/200",
      "https://picsum.photos/id/60/200/200",
      "https://picsum.photos/id/70/200/200",
      "https://picsum.photos/id/80/200/200",
    ],
    tags: ["리액트", "타입스크립트", "테일윈드", "스토리북", "코드리뷰"],
    userImage: undefined,
  },
};

export const Minimal: Story = {
  args: {
    postImage: [],
    tags: [],
    content: "이미지와 태그가 없는 최소 사양 카드입니다.",
  },
};
