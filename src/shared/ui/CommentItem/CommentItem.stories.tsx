import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "@storybook/test";

import { CommentItem } from "./CommentItem";

const meta = {
  title: "Shared/UI/CommentItem",
  component: CommentItem,
  tags: ["autodocs"],
  args: {
    id: "1", // 추가
    postId: 100, // 추가
    onReport: fn(), // 추가
  },
  parameters: {
    docs: {
      description: {
        component:
          "댓글 컴포넌트입니다.<br /><br />base/reply/deleted/deletedReply 네 가지 상태가 구현됨<br /><br />상세보기(...)버튼 클릭 시 mine/others에 따른 OptionList 나타남 & 댓글 수정 기능 구현",
      },
    },
  },
} satisfies Meta<typeof CommentItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  args: {
    variant: "base",
    content: "이것은 기본 댓글입니다. 컴포넌트 구조가 아주 깔끔하네요!",
    createdAt: "2026-03-29T10:00:00", // formatTimeAgo가 처리할 수 있는 시간 형식
    isMine: false,
    isEdited: false,
    name: "프론트엔드장인",
    profileImageUrl: "https://github.com/shadcn.png", // 테스트용 임시 이미지
  },
};

// 2. 기본 답글
export const Reply: Story = {
  args: {
    variant: "reply",
    content: "맞아요, 저도 그렇게 생각합니다. 코드 참고 많이 되었습니다.",
    createdAt: "2026-03-29T11:30:00",
    isMine: false,
    isEdited: false,
    name: "리액트초보",
    profileImageUrl: "https://github.com/shadcn.png",
  },
};

// 3. 내 댓글 (우측 ... 버튼 클릭 시 수정/삭제 메뉴 노출)
export const Mine: Story = {
  args: {
    variant: "base",
    content:
      "내가 작성한 댓글입니다. 우측 메뉴를 열면 '수정'과 '삭제'가 보여야 합니다.",
    createdAt: "2026-03-29T12:00:00",
    isMine: true,
    isEdited: false,
    name: "내닉네임",
    profileImageUrl: "https://github.com/shadcn.png",
  },
};

// 4. 수정된 내 댓글 ('수정됨' 라벨 표시)
export const Edited: Story = {
  args: {
    variant: "base",
    content: "이 댓글은 작성 후 한 번 수정되었습니다.",
    createdAt: "2026-03-29T13:00:00",
    isMine: true,
    isEdited: true, // 수정됨 표시
    name: "내닉네임",
    profileImageUrl: "https://github.com/shadcn.png",
  },
};

// 5. 프로필 이미지가 없는 댓글 (기본 회색 배경 렌더링 확인용)
export const NoProfileImage: Story = {
  args: {
    variant: "base",
    content: "프로필 이미지가 등록되지 않은 유저의 댓글입니다.",
    createdAt: "2026-03-29T14:00:00",
    isMine: false,
    name: "익명유저",
    // profileImageUrl 생략
  },
};

// 6. 삭제된 기본 댓글
export const Deleted: Story = {
  args: {
    variant: "deleted",
    content: "", // 삭제된 상태라 본문은 렌더링되지 않음
    createdAt: "2026-03-29T10:00:00",
    isMine: false,
    name: "알수없음",
  },
};

// 7. 삭제된 답글
export const DeletedReply: Story = {
  args: {
    variant: "deletedReply",
    content: "",
    createdAt: "2026-03-29T11:00:00",
    isMine: false,
    name: "알수없음",
  },
};
