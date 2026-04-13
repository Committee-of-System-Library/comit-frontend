import bannerImg from "@/assets/home/banner/Banner.png";
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
    id: 1,
    imageUrl: bannerImg,
    alt: "메인 배너 1",
  },
  {
    id: 2,
    imageUrl: bannerImg2,
    alt: "메인 배너 2",
  },
  {
    id: 3,
    imageUrl: bannerImg3,
    alt: "메인 배너 3",
  },
];
