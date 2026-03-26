import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  BoardSelectField,
  type BoardSelectFieldProps,
} from "./BoardSelectField";

const boardOptions = [
  { label: "Q&A 게시판", value: "qna" },
  { label: "정보게시판", value: "info" },
  { label: "자유게시판", value: "free" },
];

const InteractiveBoardSelectField = (args: BoardSelectFieldProps) => {
  const [value, setValue] = useState<string | undefined>(args.value);

  return (
    <div className="w-full max-w-[460px]">
      <BoardSelectField {...args} value={value} onChange={setValue} />
    </div>
  );
};

const meta = {
  title: "shared/ui/BoardSelectField",
  component: BoardSelectField,
  tags: ["autodocs"],
  args: {
    label: "게시판",
    placeholder: "게시판 선택하기",
    options: boardOptions,
    disabled: false,
  },
  render: (args) => <InteractiveBoardSelectField {...args} />,
} satisfies Meta<typeof BoardSelectField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: "qna",
  },
};

export const EdgeCase: Story = {
  args: {
    value: undefined,
    options: [
      {
        label: "아주 길고 복잡한 이름의 게시판 옵션 텍스트 상태 확인용 케이스",
        value: "long-board-name",
      },
      ...boardOptions,
    ],
    errorMessage: "게시판은 반드시 선택해야 합니다",
  },
};
