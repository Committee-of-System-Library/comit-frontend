import { FileText, Heart, MessageCircleMore } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useLogoutMutation } from "@/features/auth/model/useLogoutMutation";
import { useMyCommentsQuery } from "@/features/member/model/useMyCommentsQuery";
import { useMyLikesQuery } from "@/features/member/model/useMyLikesQuery";
import { useMyPostsQuery } from "@/features/member/model/useMyPostsQuery";
import { useMyProfileQuery } from "@/features/member/model/useMyProfileQuery";
import { useUpdateNicknameMutation } from "@/features/member/model/useUpdateNicknameMutation";
import { useUpdateStudentNumberVisibilityMutation } from "@/features/member/model/useUpdateStudentNumberVisibilityMutation";
import { LogoutButton } from "@/shared/ui/LogoutButton/LogoutButton";
import { StudentNumberVisibilityToggle } from "@/shared/ui/StudentNumberVisibilityToggle/StudentNumberVisibilityToggle";
import { formatTimeAgo } from "@/utils/formatTime";
import { MyActivitySectionBoard } from "@/widgets/mypage/MyActivitySectionBoard/MyActivitySectionBoard";
import { ProfileWidget } from "@/widgets/mypage/ProfileWidget/ProfileWidget";

const MyPage = () => {
  const navigate = useNavigate();
  const { data: profile } = useMyProfileQuery();
  const { mutate: updateNickname } = useUpdateNicknameMutation();
  const { mutate: updateStudentNumberVisibility } =
    useUpdateStudentNumberVisibilityMutation();
  const { mutate: logoutMutate } = useLogoutMutation();
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

  const isActivityLoading =
    isPostsLoading || isCommentsLoading || isLikesLoading;
  const isActivityError = isPostsError || isCommentsError || isLikesError;

  const handleProfileSave = ({
    userName,
  }: {
    userName: string;
    imageFile: File | null;
  }) => {
    updateNickname(userName);
  };

  const handleLogout = () => {
    logoutMutate();
  };

  const handleMoreClick = (category: "posts" | "comments" | "likes") => {
    navigate("/mypage/activity", { state: { category } });
  };

  const myPostItems = (postsData?.items ?? []).map((post) => ({
    id: post.postId,
    title: post.title,
    createdAt: formatTimeAgo(post.createdAt),
    onClick: () => navigate(`/post/${post.postId}`),
  }));

  const myCommentItems = (commentsData?.items ?? []).map((comment) => ({
    id: comment.commentId,
    title: comment.postTitle,
    createdAt: formatTimeAgo(comment.createdAt),
    onClick: () => navigate(`/post/${comment.postId}`),
  }));

  const myLikeItems = (likesData?.items ?? []).map((like) => ({
    id: like.postId,
    title: like.title,
    createdAt: formatTimeAgo(like.createdAt),
    onClick: () => navigate(`/post/${like.postId}`),
  }));

  return (
    <div className="flex flex-col gap-10">
      <h1 className="text-head-02 text-text-primary px-1">마이페이지</h1>

      <div className="flex gap-6 items-start">
        <div className="flex flex-col gap-10 w-[384px]">
          <section className="flex flex-col gap-3">
            <h2 className="text-subtitle-01 text-text-secondary px-3">
              프로필 관리
            </h2>
            <ProfileWidget
              initialUserName={profile?.nickname ?? ""}
              major="전공"
              studentId={profile?.studentNumber ?? ""}
              imgURL={null}
              onSave={handleProfileSave}
            />
            <StudentNumberVisibilityToggle
              studentNumber={profile?.studentNumber ?? ""}
              visible={profile?.studentNumberVisible ?? false}
              onToggle={updateStudentNumberVisibility}
            />
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-subtitle-01 text-text-secondary px-3">
              계정 관리
            </h2>
            <LogoutButton onClick={handleLogout} />
          </section>
        </div>

        <div className="flex-1 flex flex-col gap-3">
          <h2 className="text-subtitle-01 text-text-secondary px-3">내 활동</h2>
          <div className="bg-white border border-border-deactivated rounded-2xl p-5 flex flex-col gap-10">
            {isActivityLoading ? (
              <span className="text-body-03 text-text-secondary font-medium text-center py-10">
                로딩 중...
              </span>
            ) : isActivityError ? (
              <span className="text-body-03 text-text-secondary font-medium text-center py-10">
                데이터를 불러오지 못했습니다.
              </span>
            ) : (
              <>
                <MyActivitySectionBoard
                  title="내가 쓴 글"
                  count={postsData?.totalCount ?? 0}
                  icon={<FileText size={18} />}
                  items={myPostItems}
                  onMoreClick={() => handleMoreClick("posts")}
                />

                <MyActivitySectionBoard
                  title="내가 쓴 댓글"
                  count={commentsData?.totalCount ?? 0}
                  icon={<MessageCircleMore size={18} />}
                  items={myCommentItems}
                  onMoreClick={() => handleMoreClick("comments")}
                />

                <MyActivitySectionBoard
                  title="좋아요"
                  count={likesData?.totalCount ?? 0}
                  icon={<Heart size={18} />}
                  items={myLikeItems}
                  onMoreClick={() => handleMoreClick("likes")}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
