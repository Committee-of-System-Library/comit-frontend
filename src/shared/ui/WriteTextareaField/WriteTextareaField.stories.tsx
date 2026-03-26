import type { Meta, StoryObj } from "@storybook/react-vite";

import { WriteTextareaField } from "./WriteTextareaField";

const meta = {
  title: "shared/ui/WriteTextareaField",
  component: WriteTextareaField,
  tags: ["autodocs"],
  args: {
    label: "본문",
    placeholder: "게시글 상세에 맞지 않는 글은 삭제될 수 있습니다",
    maxLength: 500,
    disabled: false,
  },
} satisfies Meta<typeof WriteTextareaField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: "",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: "입력된 내용",
  },
};

export const EdgeCase: Story = {
  args: {
    value:
      "아주 긴 본문이 입력되는 상황에서 줄바꿈과 내부 여백, 글자수 카운터 정렬이 안정적으로 유지되는지 확인하기 위한 케이스입니다.",
    errorMessage: "본문을 최소 10자 이상 입력해 주세요",
  },
};
