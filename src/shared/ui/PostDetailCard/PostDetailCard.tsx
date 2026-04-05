import { useState, useRef, useEffect } from "react";

import { BoardTag } from "@/shared/ui/BoardTag/BoardTag";
import { DetailButton } from "@/shared/ui/DetailButton/DetailButton";
import { HeartButton } from "@/shared/ui/HeartButton/HeartButton";
import { OptionList } from "@/shared/ui/OptionList/OptionList";
import { ShareButton } from "@/shared/ui/ShareButton/ShareButton";
import type { Post } from "@/types/post";

interface PostDetailCardProps extends Post {
  userImage?: string;
  disabled?: boolean;
  isMine?: boolean;
  onClick?: () => void;
  onEdit?: () => void;
  onLikeClick?: () => void;
  isLikePending?: boolean;
  shareUrl?: string;
}

export const PostDetailCard = ({
  title,
  content,
  user,
  heart,
  likedByMe = false,
  createdAt,
  view,
  image = [],
  tag = [],
  userImage,
  disabled = false,
  isMine = false,
  onEdit,
  onLikeClick,
  isLikePending = false,
  shareUrl,
}: PostDetailCardProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false);

  useEffect(() => {
    const checkScrollable = () => {
      if (scrollRef.current) {
        const { scrollWidth, clientWidth } = scrollRef.current;
        setIsScrollable(scrollWidth > clientWidth);
      }
    };
    checkScrollable();
    window.addEventListener("resize", checkScrollable);
    return () => window.removeEventListener("resize", checkScrollable);
  }, [image]);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const maxScroll = scrollWidth - clientWidth;
    const progress = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0;
    setScrollProgress(progress);
  };

  return (
    <article
      className={`w-full p-6 flex flex-col gap-4 rounded-3xl border border-border-deactivated bg-background-light transition-all duration-200 ${
        disabled ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden shrink-0">
            {userImage && (
              <img
                src={userImage}
                alt={user}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <span className="text-label-03 text-text-secondary">{user}</span>
        </div>
        <div className="relative">
          <DetailButton onClick={() => setIsMenuOpen(!isMenuOpen)} />
          {isMenuOpen && (
            <div className="absolute right-0 top-full z-10 mt-1">
              <OptionList mode={isMine ? "myPost" : "others"} onEdit={onEdit} />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2 w-full">
        <h2 className="text-head-03 text-text-primary wrap-break-word">
          {title}
        </h2>
        <p className="text-body-01 text-text-tertiary whitespace-pre-wrap wrap-break-word">
          {content}
        </p>
      </div>

      {image.length > 0 && (
        <div className="flex flex-col gap-3">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-3 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory cursor-grab active:cursor-grabbing"
          >
            {image.map((img, idx) => (
              <div
                key={idx}
                className="w-48 h-48 shrink-0 rounded-lg bg-gray-50 overflow-hidden snap-start"
              >
                <img
                  src={img}
                  alt={`post-img-${idx}`}
                  className="w-full h-full object-cover pointer-events-none"
                />
              </div>
            ))}
          </div>
          {isScrollable && (
            <div className="relative w-full h-0.75 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="absolute h-full bg-gray-500 rounded-full transition-all duration-150 ease-out"
                style={{
                  width: `${100 / image.length}%`,
                  left: `${scrollProgress * (1 - 1 / image.length)}%`,
                }}
              />
            </div>
          )}
        </div>
      )}

      {tag.length > 0 && (
        <div className="flex gap-2 flex-wrap mt-1">
          {tag.map((t, index) => (
            <BoardTag
              key={`${t}-${index}`}
              label={`# ${t}`}
              className="bg-gray-50! px-2! py-1! rounded-b-sm! text-caption-02! text-text-tertiary!"
            />
          ))}
        </div>
      )}

      <div className="flex gap-3 text-caption-01 text-text-placeholder">
        <span>{createdAt}</span>
        <span>조회수 {view}</span>
      </div>

      <div className="flex gap-2">
        <HeartButton
          count={heart}
          disabled={disabled || isLikePending}
          onClick={onLikeClick}
          variant={likedByMe ? "liked" : "unLiked"}
        />
        <ShareButton url={shareUrl} />
      </div>
    </article>
  );
};
