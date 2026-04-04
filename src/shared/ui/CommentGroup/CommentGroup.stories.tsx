import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "@storybook/test";

import { CommentGroup } from "./CommentGroup";

const meta = {
  title: "Shared/UI/CommentGroup",
  component: CommentGroup,
  tags: ["autodocs"],
  args: {
    postId: 1,
    onReport: fn((id, name, content) =>
      console.info("신고하기:", id, name, content),
    ),
  },
  parameters: {
    docs: {
      description: {
        component: "부모 댓글 + 자식 답글들을 한 번에 보여주는 컴포넌트입니다.",
      },
    },
  },
} satisfies Meta<typeof CommentGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    comment: {
      id: "comment-1",
      variant: "base",
      name: "프론트엔드장인",
      profileImageUrl: "https://github.com/shadcn.png",
      content: "이 글 정말 유익하네요! 잘 읽고 갑니다.",
      createdAt: "2026-03-29T10:00:00",
      isMine: false,
      isEdited: false,
      replies: [],
    },
  },
};

export const WithReplies: Story = {
  args: {
    comment: {
      id: "comment-2",
      variant: "base",
      name: "질문자",
      profileImageUrl: "https://github.com/shadcn.png",
      content: "이 부분에서 에러가 나는데 어떻게 해결하나요?",
      createdAt: "2026-03-29T09:00:00",
      isMine: false,
      isEdited: true,
      replies: [
        {
          id: "reply-1",
          variant: "reply",
          name: "지나가던개발자",
          profileImageUrl: "https://github.com/shadcn.png",
          content: "npm install 다시 해보시겠어요?",
          createdAt: "2026-03-29T09:30:00",
          isMine: false,
        },
        {
          id: "reply-2",
          variant: "reply",
          name: "내닉네임",
          profileImageUrl: "https://github.com/shadcn.png",
          content: "오 저도 같은 문제 겪었는데 덕분에 해결했습니다!",
          createdAt: "2026-03-29T10:15:00",
          isMine: true,
        },
      ],
    },
  },
};

export const DeletedParentWithReplies: Story = {
  args: {
    comment: {
      id: "comment-3",
      variant: "deleted",
      name: "알수없음",
      content: "",
      createdAt: "2026-03-29T08:00:00",
      isMine: false,
      replies: [
        {
          id: "reply-3",
          variant: "reply",
          name: "답글작성자",
          profileImageUrl: "https://github.com/shadcn.png",
          content: "원댓 삭제되었지만 답글은 남겨둡니다.",
          createdAt: "2026-03-29T08:30:00",
          isMine: false,
        },
      ],
    },
  },
};

export const WithDeletedReply: Story = {
  args: {
    comment: {
      id: "comment-4",
      variant: "base",
      name: "원글작성자",
      profileImageUrl: "https://github.com/shadcn.png",
      content: "재밌는 사실 하나 알려드립니다.",
      createdAt: "2026-03-29T11:00:00",
      isMine: true,
      replies: [
        {
          id: "reply-4",
          variant: "deletedReply",
          name: "알수없음",
          content: "",
          createdAt: "2026-03-29T11:10:00",
          isMine: false,
        },
        {
          id: "reply-5",
          variant: "reply",
          name: "다른유저",
          profileImageUrl: "https://github.com/shadcn.png",
          content: "진짜 신기하네요!",
          createdAt: "2026-03-29T11:20:00",
          isMine: false,
        },
      ],
    },
  },
};
