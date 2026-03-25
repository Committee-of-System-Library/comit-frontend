import type { Meta, StoryObj } from "@storybook/react-vite";

type DemoButtonProps = {
  disabled?: boolean;
  label: string;
  tone: "primary" | "secondary";
};

const DemoButton = ({ disabled = false, label, tone }: DemoButtonProps) => {
  const baseClass =
    "rounded-md px-4 py-2 text-label-03 transition-colors disabled:cursor-not-allowed disabled:opacity-50";
  const toneClass =
    tone === "primary"
      ? "bg-blue-700 text-white hover:bg-blue-600"
      : "border border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800";

  return (
    <button
      className={`${baseClass} ${toneClass}`}
      disabled={disabled}
      type="button"
    >
      {label}
    </button>
  );
};

const meta = {
  title: "Foundations/Story Template",
  component: DemoButton,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "팀 공통 스토리 템플릿입니다. 신규 컴포넌트는 최소 `Default`, `Disabled`, `EdgeCase` 스토리를 작성하세요.",
      },
    },
  },
  args: {
    label: "버튼 텍스트",
    tone: "primary",
    disabled: false,
  },
  argTypes: {
    tone: {
      control: "radio",
      options: ["primary", "secondary"],
    },
  },
} satisfies Meta<typeof DemoButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const EdgeCase: Story = {
  args: {
    label: "아주 긴 텍스트 버튼 레이블 상태를 확인하기 위한 예시",
    tone: "secondary",
  },
};
