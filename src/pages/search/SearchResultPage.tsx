import { useState } from "react";

import { useNavigate, useSearchParams } from "react-router-dom";

import { NoSearchResult } from "@/components/common/NoSearchResult";
import { mapPostSummaryToBoardPostCardItem } from "@/features/post/model/postUiMappers";
import { useSearchPostsQuery } from "@/features/post/model/useSearchPostsQuery";
import { Pagination } from "@/shared/ui/Pagination/Pagination";
import { PostCard } from "@/shared/ui/PostCard/PostCard";
import { SearchLong } from "@/shared/ui/SearchLong/SearchLong";

const PAGE_SIZE = 10;

const SearchResultPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") ?? "";

  const [currentPage, setCurrentPage] = useState(1);
  const [cursors, setCursors] = useState<Record<number, number | undefined>>(
    {},
  );
  const [prevKeyword, setPrevKeyword] = useState(keyword);

  if (prevKeyword !== keyword) {
    setPrevKeyword(keyword);
    setCurrentPage(1);
    setCursors({});
  }

  const cursor = cursors[currentPage];
  const { data, isError, isLoading } = useSearchPostsQuery({
    keyword,
    cursor,
    size: PAGE_SIZE,
  });

  const posts = (data?.posts ?? []).map(mapPostSummaryToBoardPostCardItem);
  const totalPages = data ? Math.ceil(data.totalCount / PAGE_SIZE) : 0;

  const handleSearch = (value: string) => {
    if (!value.trim()) return;
    navigate(`/search?keyword=${encodeURIComponent(value.trim())}`);
  };

  const handlePostClick = (postId: number) => {
    navigate(`/post/${postId}`);
  };

  const handlePageChange = (page: number) => {
    if (page === currentPage + 1 && data?.nextCursorId != null) {
      setCursors((prev) => ({ ...prev, [page]: data.nextCursorId! }));
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col px-4 pt-4 pb-5">
      <section className="flex flex-col gap-10 pb-6">
        <h1 className="text-head-02 text-text-primary">
          {keyword ? `"${keyword}" 검색 결과` : "검색 결과"}
        </h1>
        <SearchLong onSearch={handleSearch} />
      </section>

      <section className="flex flex-col gap-4">
        {isLoading ? (
          <div className="rounded-xl border border-border-deactivated bg-background-light px-4 py-10 text-center text-body-02 text-text-tertiary">
            검색 결과를 불러오는 중입니다.
          </div>
        ) : isError ? (
          <div className="rounded-xl border border-border-deactivated bg-background-light px-4 py-10 text-center text-body-02 text-error-03">
            검색 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.
          </div>
        ) : posts.length > 0 ? (
          posts.map((post) => (
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
          ))
        ) : (
          <NoSearchResult searchWord={keyword} />
        )}
      </section>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </main>
  );
};

export default SearchResultPage;
