import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "@storybook/test";

import { ReportModal } from "./ReportModal";

const meta: Meta<typeof ReportModal> = {
  title: "Shared/UI/ReportModal",
  component: ReportModal,
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
        component: "신고 모달창입니다. 신고 사유 최대 30자까지 입력 가능",
      },
    },
  },
  args: {
    disabled: false,
    user: "냠냠",
    contents: "야식메뉴 추천받을게요. 어제 마라샹궈랑 계란초밥 먹음",
    target: { type: "comment", id: 123 },
    onClose: fn(() => console.info("모달 닫기")),
  },
} satisfies Meta<typeof ReportModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
