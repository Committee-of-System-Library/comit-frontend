import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { NoSearchResult } from "@/components/common/NoSearchResult";
import type { BoardType } from "@/entities/post/model/types";
import { resolvePostDomainErrorMessage } from "@/features/post/model/postDomainErrorMessage";
import { mapPostSummaryToBoardPostCardItem } from "@/features/post/model/postUiMappers";
import { usePostListQuery } from "@/features/post/model/usePostListQuery";
import { AdminPostCard } from "@/shared/ui/AdminPostCard/AdminPostCard";
import { Pagination } from "@/shared/ui/Pagination/Pagination";
import { PostCard } from "@/shared/ui/PostCard/PostCard";
import { SearchLong } from "@/shared/ui/SearchLong/SearchLong";

const FETCH_SIZE = 100;
const ITEMS_PER_PAGE = 10;

interface PostBoardPageProps {
  boardType: BoardType;
  title: string;
  useAdminCard?: boolean;
}

export const PostBoardPage = ({
  boardType,
  title,
  useAdminCard = false,
}: PostBoardPageProps) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const { data, error, isError, isLoading } = usePostListQuery({
    boardType,
    size: FETCH_SIZE,
  });

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const mappedPosts = (data?.posts ?? []).map(
    mapPostSummaryToBoardPostCardItem,
  );
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const filteredPosts = mappedPosts.filter((post) => {
    if (!normalizedSearchTerm) {
      return true;
    }

    return (
      post.title.toLowerCase().includes(normalizedSearchTerm) ||
      post.content.toLowerCase().includes(normalizedSearchTerm) ||
      post.user.toLowerCase().includes(normalizedSearchTerm) ||
      (post.tags ?? []).some((tag) =>
        tag.toLowerCase().includes(normalizedSearchTerm),
      )
    );
  });

  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
  const currentPosts = filteredPosts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handlePostClick = (postId: number) => {
    navigate(`/post/${postId}`);
  };

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col px-4 pt-4 pb-5">
      <section className="flex flex-col gap-10 pb-6">
        <h1 className="text-head-02 text-text-primary">{title}</h1>
        <SearchLong onSearch={handleSearch} />
      </section>

      <section className="flex flex-col gap-4">
        {isLoading ? (
          <div className="rounded-xl border border-border-deactivated bg-background-light px-4 py-10 text-center text-body-02 text-text-tertiary">
            게시글을 불러오는 중입니다.
          </div>
        ) : isError ? (
          <div className="rounded-xl border border-border-deactivated bg-background-light px-4 py-10 text-center text-body-02 text-error-03">
            {resolvePostDomainErrorMessage(error, {
              auth: "로그인 후 게시글을 확인할 수 있어요.",
              default:
                "게시글을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.",
              forbidden: "이 게시판을 볼 권한이 없습니다.",
              notFound: "게시글을 찾을 수 없습니다.",
            })}
          </div>
        ) : currentPosts.length > 0 ? (
          currentPosts.map((post) =>
            useAdminCard ? (
              <AdminPostCard
                key={post.id}
                comment={post.comment}
                content={post.content}
                createdAt={post.createdAt}
                heart={post.heart}
                title={post.title}
                user={post.user}
                onClick={() => handlePostClick(post.id)}
              />
            ) : (
              <PostCard
                key={post.id}
                comment={post.comment}
                content={post.content}
                createdAt={post.createdAt}
                heart={post.heart}
                postImage={post.postImage}
                tags={post.tags}
                title={post.title}
                user={post.user}
                userImage={post.userImage}
                onClick={() => handlePostClick(post.id)}
              />
            ),
          )
        ) : normalizedSearchTerm ? (
          <NoSearchResult searchWord={searchTerm} />
        ) : (
          <div className="rounded-xl border border-border-deactivated bg-background-light px-4 py-10 text-center text-body-02 text-text-tertiary">
            등록된 게시글이 아직 없습니다.
          </div>
        )}
      </section>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </main>
  );
};
