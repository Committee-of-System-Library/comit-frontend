import { useState } from "react";

import { ArrowButton } from "@/shared/ui/ArrowButton/ArrowButton";
import { cn } from "@/shared/utils/cn";

interface BannerItem {
  id: number;
  imageUrl: string;
  link?: string;
  alt: string;
  backgroundColor?: string;
}

interface BannerProps {
  items: BannerItem[];
  className?: string;
}

export const Banner = ({ items, className }: BannerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  return (
    <div
      className={cn(
        "relative w-full aspect-[1200/208] overflow-hidden rounded-xl group",
        className,
      )}
    >
      <div
        className="flex transition-transform duration-500 ease-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="w-full h-full flex-shrink-0"
            style={{ backgroundColor: item.backgroundColor }}
          >
            <img
              src={item.imageUrl}
              alt={item.alt}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      <div className="absolute inset-y-0 left-4 flex items-center">
        <ArrowButton
          direction="left"
          onClick={handlePrev}
          className="pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity bg-white/40 hover:bg-white/60 active:bg-white/80"
        />
      </div>
      <div className="absolute inset-y-0 right-4 flex items-center">
        <ArrowButton
          direction="right"
          onClick={handleNext}
          className="pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity bg-white/40 hover:bg-white/60 active:bg-white/80"
        />
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 h-1.5 px-3 py-1">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              "size-1.5 rounded-full transition-all cursor-pointer",
              currentIndex === index
                ? "bg-secondary-600"
                : "bg-border-deactivated hover:bg-gray-300",
            )}
            aria-label={`${index + 1}번째 슬라이드로 이동`}
            aria-current={currentIndex === index ? "true" : "false"}
          />
        ))}
      </div>
    </div>
  );
};
