import type { Meta, StoryObj } from "@storybook/react-vite";

import { SearchInput } from "./SearchInput";

const meta = {
  title: "Foundations/SearchInput",
  component: SearchInput,
  tags: ["autodocs"],
  args: {
    placeholder: "검색어를 입력하세요",
  },
  render: (args) => (
    <div className="max-w-[420px]">
      <SearchInput {...args} />
    </div>
  ),
} satisfies Meta<typeof SearchInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const Typing: Story = {
  args: {
    state: "typing",
  },
};

export const EdgeCase: Story = {
  args: {
    placeholder:
      "아주 긴 검색어 플레이스홀더 상태를 확인하기 위한 예시 텍스트입니다.",
  },
};
