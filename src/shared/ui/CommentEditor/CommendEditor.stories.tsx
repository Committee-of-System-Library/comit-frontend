import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "@storybook/test";

import { CommentEditor } from "./CommentEditor";

const meta: Meta<typeof CommentEditor> = {
  title: "Shared/UI/CommentEditor",
  component: CommentEditor,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "답글 등록 & 댓글/답글 수정 두 가지 기능의 입력창입니다.",
      },
    },
  },
  args: {
    disabled: false,
    onReply: fn((val) => console.info("답글 등록 완료:", val)),
    onEdit: fn((val) => console.info("댓글/답글 수정 완료:", val)),
    onCancel: fn(() => console.info("취소 완료")),
  },
} satisfies Meta<typeof CommentEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ReplyState: Story = {
  args: {
    mode: "reply",
    disabled: false,
  },
};

export const EditState: Story = {
  args: {
    mode: "edit",
    originContent: "기존 댓글 내용 테스트",
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    mode: "reply",
    disabled: true,
  },
};
