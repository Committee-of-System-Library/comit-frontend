import { useLocation, useNavigate } from "react-router-dom";

import { useMyCommentsQuery } from "@/features/member/model/useMyCommentsQuery";
import { useMyLikesQuery } from "@/features/member/model/useMyLikesQuery";
import { useMyPostsQuery } from "@/features/member/model/useMyPostsQuery";
import { MyActivityCategory } from "@/shared/ui/MyActivityCategory/MyActivityCategory";
import { PostPreviewItem } from "@/shared/ui/PostPreviewItem/PostPreviewItem";
import { formatTimeAgo } from "@/utils/formatTime";

type CategoryType = "posts" | "comments" | "likes";

const MyActivityPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const selectedCategory =
    (location.state?.category as CategoryType) || "posts";

  const {
    data: postsData,
    isLoading: isPostsLoading,
    isError: isPostsError,
  } = useMyPostsQuery();
  const {
    data: commentsData,
    isLoading: isCommentsLoading,
    isError: isCommentsError,
  } = useMyCommentsQuery();
  const {
    data: likesData,
    isLoading: isLikesLoading,
    isError: isLikesError,
  } = useMyLikesQuery();

  const isLoadingMap = {
    posts: isPostsLoading,
    comments: isCommentsLoading,
    likes: isLikesLoading,
  };
  const isErrorMap = {
    posts: isPostsError,
    comments: isCommentsError,
    likes: isLikesError,
  };

  const isLoading = isLoadingMap[selectedCategory];
  const isError = isErrorMap[selectedCategory];

  const handleCategoryChange = (category: CategoryType) => {
    navigate("/mypage/activity", { state: { category } });
  };

  const categoryConfig = {
    posts: {
      label: "내가 쓴 글",
      totalCount: postsData?.totalCount ?? 0,
      items: (postsData?.items ?? []).map((post) => ({
        id: post.postId,
        title: post.title,
        content: post.content ?? "",
        likes: post.likeCount ?? 0,
        comments: post.commentCount ?? 0,
        time: formatTimeAgo(post.createdAt),
        onClick: () => navigate(`/post/${post.postId}`),
      })),
    },
    comments: {
      label: "내가 쓴 댓글",
      totalCount: commentsData?.totalCount ?? 0,
      items: (commentsData?.items ?? []).map((comment) => ({
        id: comment.commentId,
        title: comment.postTitle,
        content: comment.content,
        likes: comment.likeCount ?? 0,
        comments: comment.commentCount ?? 0,
        time: formatTimeAgo(comment.createdAt),
        onClick: () => navigate(`/post/${comment.postId}`),
      })),
    },
    likes: {
      label: "내가 좋아요한 글",
      totalCount: likesData?.totalCount ?? 0,
      items: (likesData?.items ?? []).map((like) => ({
        id: like.postId,
        title: like.title,
        content: like.content ?? "",
        likes: like.likeCount ?? 0,
        comments: like.commentCount ?? 0,
        time: formatTimeAgo(like.createdAt),
        onClick: () => navigate(`/post/${like.postId}`),
      })),
    },
  };

  const current = categoryConfig[selectedCategory];

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
            label="내가 좋아요한 글"
            selected={selectedCategory === "likes"}
            onClick={() => handleCategoryChange("likes")}
          />
        </nav>
      </aside>

      <div className="flex-1 flex flex-col gap-10">
        <header className="flex items-center gap-3 text-head-02">
          <h2 className="text-text-primary">{current.label}</h2>
          <span className="text-text-deactivated">{current.totalCount}개</span>
        </header>

        <div className="flex flex-col">
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <span className="text-body-03 text-text-secondary font-medium">
                로딩 중...
              </span>
            </div>
          ) : isError ? (
            <div className="flex h-40 items-center justify-center">
              <span className="text-body-03 text-text-secondary font-medium">
                데이터를 불러오지 못했습니다.
              </span>
            </div>
          ) : current.items.length > 0 ? (
            current.items.map((item) => (
              <PostPreviewItem
                key={item.id}
                title={item.title}
                content={item.content}
                likes={item.likes}
                comments={item.comments}
                time={item.time}
                onClick={item.onClick}
                className="rounded-xl"
              />
            ))
          ) : (
            <div className="flex h-40 items-center justify-center">
              <span className="text-body-03 text-text-secondary font-medium">
                내역이 없습니다.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyActivityPage;
