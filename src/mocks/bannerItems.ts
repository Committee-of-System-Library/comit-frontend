import bannerImg2 from "@/assets/home/banner/Banner2.png";
import bannerImg3 from "@/assets/home/banner/Banner3-3.png";

export interface BannerItem {
  id: number;
  imageUrl: string;
  link?: string;
  alt: string;
  backgroundColor?: string;
}

export const mockBannerItems: BannerItem[] = [
  {
    id: 2,
    imageUrl: bannerImg2,
    alt: "메인 배너 2",
    link: "/post/94",
  },
  {
    id: 3,
    imageUrl: bannerImg3,
    alt: "메인 배너 3",
    link: "/post/95",
  },
];
