import bannerImg from "@/assets/home/banner/Banner.png";

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
    imageUrl: "https://picsum.photos/1200/208?random=1",
    alt: "메인 배너 2",
  },
  {
    id: 3,
    imageUrl: "https://picsum.photos/1200/208?random=2",
    alt: "메인 배너 3",
  },
];
