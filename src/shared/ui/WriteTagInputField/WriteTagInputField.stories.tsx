import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  WriteTagInputField,
  type WriteTagInputFieldProps,
} from "./WriteTagInputField";

const InteractiveWriteTagInputField = (args: WriteTagInputFieldProps) => {
  const [value, setValue] = useState("");
  const [tags, setTags] = useState<string[]>(["새내기", "QNA"]);
  const limit = args.maxTags ?? 5;

  return (
    <div className="w-full max-w-[640px]">
      <WriteTagInputField
        {...args}
        tags={tags}
        value={value}
        onAddTag={(nextTag) => {
          if (tags.includes(nextTag)) {
            return;
          }

          setTags((prev) => [...prev, nextTag].slice(0, limit));
        }}
        onRemoveTag={(targetTag) => {
          setTags((prev) => prev.filter((tag) => tag !== targetTag));
        }}
        onValueChange={setValue}
      />
    </div>
  );
};

const meta = {
  title: "shared/ui/WriteTagInputField",
  component: WriteTagInputField,
  tags: ["autodocs"],
  args: {
    label: "해시태그",
    helperText: "최대 5개까지 입력할 수 있습니다",
    maxTags: 5,
    disabled: false,
  },
  render: (args) => <InteractiveWriteTagInputField {...args} />,
} satisfies Meta<typeof WriteTagInputField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
    tags: ["태그1", "태그2"],
    value: "입력값",
  },
};

export const EdgeCase: Story = {
  args: {
    tags: ["긴태그텍스트예시", "중복테스트", "상태체크", "조합확인", "최대치"],
    value: "추가불가",
    errorMessage: "태그는 최대 5개까지 입력 가능합니다",
  },
};
