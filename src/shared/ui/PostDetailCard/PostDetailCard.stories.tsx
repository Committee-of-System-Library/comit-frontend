import type { Meta, StoryObj } from "@storybook/react-vite";

import { PostDetailCard } from "./PostDetailCard";

const meta = {
  title: "Shared/UI/PostDetailCard",
  component: PostDetailCard,
  tags: ["autodocs"],
  args: {
    title: "게시글 테스트 제목입니다.",
    content: "이미지와 태그 레이아웃 확인용 테스트 본문입니다.",
    user: "한나영",
    heart: 12,
    comment: 5,
    view: 100,
    createdAt: "2026.03.22 15:58",
    disabled: false,
    isMine: false,
    shareUrl: "https://comit.example.com/post/1",
    userImage: "https://picsum.photos/100",
    image: [
      "https://picsum.photos/id/10/400/400",
      "https://picsum.photos/id/20/400/400",
      "https://picsum.photos/id/30/400/400",
    ],
    tag: ["공지", "이벤트", "테스트"],
  },
} satisfies Meta<typeof PostDetailCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const MyPost: Story = {
  args: {
    user: "나 (작성자)",
    isMine: true,
  },
};

export const LongContent: Story = {
  args: {
    title:
      "제목이 아주 길어서 한 줄을 넘어가고 레이아웃을 위협할 정도로 길게 작성되었을 때 어떻게 보이나요?",
    content:
      "본문 내용이 아주 길어지는 경우입니다. 이 텍스트는 여러 줄로 구성되어 있어서 엄청 길어요. 레이아웃이 깨지지 않고 텍스트가 잘 표시되는지 확인하기 위한 테스트 케이스입니다. 본문이 길어져도 전체 카드의 형태는 유지되어야 합니다.",
    image: [
      "https://picsum.photos/id/40/400/400",
      "https://picsum.photos/id/50/400/400",
      "https://picsum.photos/id/60/400/400",
      "https://picsum.photos/id/70/400/400",
      "https://picsum.photos/id/80/400/400",
      "https://picsum.photos/id/90/400/400",
    ],
    tag: ["긴태그테스트", "레이아웃확인", "말줄임표", "엣지케이스", "리액트"],
  },
};

export const Minimal: Story = {
  args: {
    content: "이미지와 해시태그가 없는 가장 기본적인 형태의 게시글입니다.",
    image: [],
    tag: [],
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
