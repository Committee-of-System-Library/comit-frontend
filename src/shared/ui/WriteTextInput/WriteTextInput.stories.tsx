import type { Meta, StoryObj } from "@storybook/react-vite";

import { WriteTextInput } from "./WriteTextInput";

const meta = {
  title: "shared/ui/WriteTextInput",
  component: WriteTextInput,
  tags: ["autodocs"],
  args: {
    label: "제목",
    placeholder: "제목을 입력하세요",
    disabled: false,
  },
} satisfies Meta<typeof WriteTextInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: "입력된 제목",
  },
};

export const EdgeCase: Story = {
  args: {
    value:
      "아주 길고 복잡한 제목 문장이 들어왔을 때도 입력 박스 레이아웃이 깨지지 않는지 확인하는 케이스",
    errorMessage: "제목은 필수로 입력해야 합니다",
  },
};
