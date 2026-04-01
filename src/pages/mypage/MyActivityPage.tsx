import { useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import { MOCK_QNA_POSTS, type MockPostData } from "@/mocks/mockPosts";
import { MyActivityCategory } from "@/shared/ui/MyActivityCategory/MyActivityCategory";
import { Pagination } from "@/shared/ui/Pagination/Pagination";
import { PostPreviewItem } from "@/shared/ui/PostPreviewItem/PostPreviewItem";
import { formatTimeAgo } from "@/utils/formatTime";

type CategoryType = "posts" | "comments" | "likes";

interface ActivityCategoryInfo {
  label: string;
  data: MockPostData[];
}

const categoryMap: Record<CategoryType, ActivityCategoryInfo> = {
  posts: { label: "내가 쓴 글", data: MOCK_QNA_POSTS },
  comments: { label: "내가 쓴 댓글", data: MOCK_QNA_POSTS },
  likes: { label: "내가 좋아요한 댓글", data: MOCK_QNA_POSTS },
};

const ITEMS_PER_PAGE = 10;

const MyActivityPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const selectedCategory =
    (location.state?.category as CategoryType) || "posts";
  const currentCategoryData = categoryMap[selectedCategory];

  const totalItems = currentCategoryData.data.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = currentCategoryData.data.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const handleCategoryChange = (category: CategoryType) => {
    navigate("/mypage/activity", { state: { category } });
    setCurrentPage(1);
  };

  return (
    <div className="flex gap-6 items-start">
      <aside className="flex flex-col gap-11 w-[282px] shrink-0">
        <h1 className="text-head-02 text-text-primary">내 활동</h1>
        <nav className="flex flex-col gap-4">
          <MyActivityCategory
            label="내가 쓴 글"
            selected={selectedCategory === "posts"}
            onClick={() => handleCategoryChange("posts")}
          />
          <MyActivityCategory
            label="내가 쓴 댓글"
            selected={selectedCategory === "comments"}
            onClick={() => handleCategoryChange("comments")}
          />
          <MyActivityCategory
            label="내가 좋아요한 댓글"
            selected={selectedCategory === "likes"}
            onClick={() => handleCategoryChange("likes")}
          />
        </nav>
      </aside>

      <div className="flex-1 flex flex-col gap-10">
        <header className="flex items-center gap-3 text-head-02">
          <h2 className="text-text-primary">{currentCategoryData.label}</h2>
          <span className="text-text-deactivated">{totalItems}개</span>
        </header>

        <div className="flex flex-col gap-10 items-center">
          <div className="flex flex-col gap-4 w-full">
            {currentItems.map((item) => (
              <PostPreviewItem
                key={item.id}
                title={item.title}
                content={item.content}
                author={item.user}
                likes={item.heart}
                comments={item.comment}
                time={formatTimeAgo(item.createdAt)}
                imageUrl={item.postImage?.[0]}
              />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default MyActivityPage;
