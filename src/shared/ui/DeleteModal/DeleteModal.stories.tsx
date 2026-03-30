import type { Meta, StoryObj } from "@storybook/react-vite";

import { DeleteModal } from "./DeleteModal";

const meta = {
  title: "Shared/UI/DeleteModal",
  component: DeleteModal,
  tags: ["autodocs"],
  decorators: [
    (Story) => {
      if (!document.getElementById("modal-portal")) {
        const portalRoot = document.createElement("div");
        portalRoot.setAttribute("id", "modal-portal");
        document.body.appendChild(portalRoot);
      }
      return <Story />;
    },
  ],
  parameters: {
    docs: {
      description: {
        component: "내 게시글/댓글 삭제 모달",
      },
    },
  },
} satisfies Meta<typeof DeleteModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PostSate: Story = {
  args: {
    target: "post",
    onClose: () => {},
    onConfirm: () => {},
  },
};

export const CommentSate: Story = {
  args: {
    target: "comment",
    onClose: () => {},
    onConfirm: () => {},
  },
};
