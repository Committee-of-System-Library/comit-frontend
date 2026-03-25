import { useState } from "react";

import { MOCK_QNA_POSTS } from "@/mocks/mockPosts";
import { AdminPostCard } from "@/shared/ui/AdminPostCard/AdminPostCard";
import { Pagination } from "@/shared/ui/Pagination/Pagination";
import { SearchLong } from "@/shared/ui/SearchLong/SearchLong";

const ITEMS_PER_PAGE = 10;
const NoticeBoardPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const filteredPosts = MOCK_QNA_POSTS.filter((post) => {
    if (!searchTerm) return true;

    const lowerKeyword = searchTerm.toLowerCase();
    return (
      post.title.toLowerCase().includes(lowerKeyword) ||
      post.content.toLowerCase().includes(lowerKeyword)
    );
  });

  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
  const currentPosts = filteredPosts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <main className="max-w-4xl mx-auto w-full px-4 pt-4 pb-5 flex flex-col">
      <section className="flex flex-col gap-10 pb-6">
        <h1 className="text-head-02 text-text-primary">공지사항</h1>
        <SearchLong onSearch={handleSearch} />
      </section>
      <section className="flex flex-col gap-4">
        {currentPosts.length > 0 ? (
          currentPosts.map((post) => (
            <AdminPostCard
              key={post.id}
              title={post.title}
              content={post.content}
              user={post.user}
              heart={post.heart}
              comment={post.comment}
              createdAt={post.createdAt}
              // onClick={() => router.push(`/qna/${post.id}`)}
            />
          ))
        ) : (
          <div className="py-20 text-center text-text-tertiary">
            {searchTerm
              ? `'${searchTerm}'에 대한 검색 결과가 없습니다.`
              : "게시글이 존재하지 않습니다."}
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
export default NoticeBoardPage;
