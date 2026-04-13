import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "@storybook/test";

import { ImageViewerModal } from "./ImageViewerModal";

const meta: Meta<typeof ImageViewerModal> = {
  title: "Shared/UI/ImageViewerModal",
  component: ImageViewerModal,
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
        component:
          "게시글 상세 페이지 등에서 사진을 클릭했을 때 전체화면으로 보여주는 이미지 뷰어 모달입니다. 좌우 슬라이드와 ESC 키 닫기를 지원합니다.",
      },
    },
  },
  args: {
    images: [
      "https://picsum.photos/id/1018/800/600",
      "https://picsum.photos/id/1015/600/800",
      "https://picsum.photos/id/1019/800/800",
    ],
    initialIndex: 0,
    onClose: fn(() => console.info("모달 닫기 이벤트 발생")),
  },
} satisfies Meta<typeof ImageViewerModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const StartFromSecondImage: Story = {
  args: {
    initialIndex: 1,
  },
};
