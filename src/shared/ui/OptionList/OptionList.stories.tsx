import type { Meta, StoryObj } from "@storybook/react-vite";

import { OptionList } from "./OptionList";

const meta = {
  title: "Shared/UI/OptionList",
  component: OptionList,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "댓글 상세 모달입니다. mine: 삭제 & 편집 / others: 신고 버튼 표시",
      },
    },
  },
} satisfies Meta<typeof OptionList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MineState: Story = {
  args: {
    mode: "mine",
  },
};

export const OthersState: Story = {
  args: {
    mode: "others",
  },
};
