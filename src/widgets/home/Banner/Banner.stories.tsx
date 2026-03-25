import type { Meta, StoryObj } from "@storybook/react-vite";

import { Banner } from "./Banner";

import bannerImg from "@/assets/home/banner/Banner.png";

const meta = {
  title: "Widgets/Home/Banner",
  component: Banner,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Banner>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockBannerItems = [
  {
    id: 1,
    imageUrl: bannerImg,
    alt: "Banner 1",
  },
  {
    id: 2,
    imageUrl: "https://picsum.photos/1200/208?random=2",
    alt: "Banner 2",
  },
  {
    id: 3,
    imageUrl: "https://picsum.photos/1200/208?random=3",
    alt: "Banner 3",
  },
];

export const Default: Story = {
  args: {
    items: mockBannerItems,
    className: "max-w-[1200px] mx-auto my-10",
  },
};
