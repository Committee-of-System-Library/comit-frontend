import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  WriteImageUploadField,
  type WriteImageUploadFieldProps,
  type WriteImageUploadItem,
} from "./WriteImageUploadField";

const createMockFile = (name: string, type = "image/png") =>
  new File(["storybook"], name, { type });

const initialFiles: WriteImageUploadItem[] = [
  {
    file: createMockFile("예시 이미지.png"),
    id: "1",
    name: "예시 이미지.png",
    sizeLabel: "1.2MB",
  },
  {
    file: createMockFile("배너 시안.jpg", "image/jpeg"),
    id: "2",
    name: "배너 시안.jpg",
    sizeLabel: "850KB",
  },
];

const InteractiveWriteImageUploadField = (args: WriteImageUploadFieldProps) => {
  const [files, setFiles] = useState<WriteImageUploadItem[]>(initialFiles);
  const limit = args.maxFiles ?? 5;

  return (
    <div className="w-full max-w-[640px]">
      <WriteImageUploadField
        {...args}
        files={files}
        onFilesSelect={(selectedFiles) => {
          const nextFiles = [...selectedFiles].map((file, index) => ({
            file,
            id: `${file.name}-${index}`,
            name: file.name,
            sizeLabel: `${Math.ceil(file.size / 1024)}KB`,
          }));

          setFiles((prev) => [...prev, ...nextFiles].slice(0, limit));
        }}
        onRemoveFile={(id) => {
          setFiles((prev) => prev.filter((file) => file.id !== id));
        }}
      />
    </div>
  );
};

const meta = {
  title: "shared/ui/WriteImageUploadField",
  component: WriteImageUploadField,
  tags: ["autodocs"],
  args: {
    label: "이미지 첨부",
    helperText: "최대 5장까지 업로드할 수 있습니다",
    maxFiles: 5,
    disabled: false,
  },
  render: (args) => <InteractiveWriteImageUploadField {...args} />,
} satisfies Meta<typeof WriteImageUploadField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
    files: initialFiles,
  },
};

export const EdgeCase: Story = {
  args: {
    files: [
      {
        file: createMockFile(
          "아주_길고_복잡한_파일명_테스트_이미지_데이터_입니다_레이아웃_확인용.png",
        ),
        id: "long-file-name",
        name: "아주_길고_복잡한_파일명_테스트_이미지_데이터_입니다_레이아웃_확인용.png",
        sizeLabel: "9.9MB",
      },
    ],
    errorMessage: "이미지는 최대 5장까지 업로드할 수 있습니다",
  },
};
