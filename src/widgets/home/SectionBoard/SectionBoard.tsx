import { ChevronRight } from "lucide-react";

import { PostPreviewItem } from "@/shared/ui/PostPreviewItem/PostPreviewItem";

interface Post {
  title: string;
  content: string;
  author: string;
  likes: number | string;
  comments: number | string;
  time: string;
  imageUrl?: string;
}

interface SectionBoardProps {
  title: string;
  posts: Post[];
  onViewAll?: () => void;
}

export const SectionBoard = ({
  title,
  posts,
  onViewAll,
}: SectionBoardProps) => {
  return (
    <section className="flex flex-col gap-3 w-full">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-subtitle-01 text-text-primary">{title}</h2>
        <button
          onClick={onViewAll}
          className="flex items-center gap-1 text-label-04 text-text-deactivated hover:text-text-secondary transition-colors cursor-pointer"
        >
          <span>전체보기</span>
          <ChevronRight className="size-4" />
        </button>
      </div>
      <div className="flex flex-col border border-border-deactivated rounded-xl overflow-hidden bg-white">
        {posts.map((post, index) => (
          <PostPreviewItem
            key={index}
            {...post}
            className="border-0 border-b border-border-deactivated last:border-b-0 rounded-none max-w-none shadow-none"
          />
        ))}
      </div>
    </section>
  );
};
