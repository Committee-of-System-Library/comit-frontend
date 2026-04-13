import { FileText, Heart, MessageCircleMore } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useLogoutMutation } from "@/features/auth/model/useLogoutMutation";
import { useMyActivityQuery } from "@/features/member/model/useMyActivityQuery";
import { useMyProfileQuery } from "@/features/member/model/useMyProfileQuery";
import { useUpdateProfileMutation } from "@/features/member/model/useUpdateProfileMutation";
import { useUpdateStudentNumberVisibilityMutation } from "@/features/member/model/useUpdateStudentNumberVisibilityMutation";
import { LogoutButton } from "@/shared/ui/LogoutButton/LogoutButton";
import { StudentNumberVisibilityToggle } from "@/shared/ui/StudentNumberVisibilityToggle/StudentNumberVisibilityToggle";
import { formatTimeAgo } from "@/utils/formatTime";
import { MyActivitySectionBoard } from "@/widgets/mypage/MyActivitySectionBoard/MyActivitySectionBoard";
import { ProfileWidget } from "@/widgets/mypage/ProfileWidget/ProfileWidget";

const MyPage = () => {
  const navigate = useNavigate();
  const { data: profile } = useMyProfileQuery();
  const { mutate: updateProfile } = useUpdateProfileMutation();
  const { mutate: updateStudentNumberVisibility } =
    useUpdateStudentNumberVisibilityMutation();
  const { mutate: logoutMutate } = useLogoutMutation();
  const {
    data: activityData,
    isLoading: isActivityLoading,
    isError: isActivityError,
  } = useMyActivityQuery();

  const handleProfileSave = ({
    userName,
    imageFile,
  }: {
    userName: string;
    imageFile: File | null;
  }) => {
    updateProfile({ nickname: userName, imageFile });
  };

  const handleLogout = () => {
    logoutMutate();
  };

  const handleMoreClick = (category: "posts" | "comments" | "likes") => {
    navigate("/mypage/activity", { state: { category } });
  };

  const myPostItems = (activityData?.recentPosts ?? []).map((post) => ({
    id: post.id,
    title: post.title,
    createdAt: formatTimeAgo(post.createdAt),
    onClick: () => navigate(`/post/${post.id}`),
  }));

  const myCommentItems = (activityData?.recentComments ?? []).map(
    (comment) => ({
      id: comment.id,
      title: comment.postTitle,
      createdAt: formatTimeAgo(comment.createdAt),
      onClick: () => navigate(`/post/${comment.postId}`),
    }),
  );

  const myLikeItems = (activityData?.recentLikes ?? []).map((like) => ({
    id: like.postId,
    title: like.postTitle,
    createdAt: formatTimeAgo(like.likedAt),
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
              imgURL={profile?.profileImageUrl ?? null}
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
            <MyActivitySectionBoard
              title="내가 쓴 글"
              count={activityData?.postCount ?? 0}
              icon={<FileText size={18} />}
              items={isActivityLoading || isActivityError ? [] : myPostItems}
              onMoreClick={() => handleMoreClick("posts")}
              statusMessage={
                isActivityLoading
                  ? "로딩 중..."
                  : isActivityError
                    ? "데이터를 불러오지 못했습니다."
                    : undefined
              }
            />

            <MyActivitySectionBoard
              title="내가 쓴 댓글"
              count={activityData?.commentCount ?? 0}
              icon={<MessageCircleMore size={18} />}
              items={isActivityLoading || isActivityError ? [] : myCommentItems}
              onMoreClick={() => handleMoreClick("comments")}
              statusMessage={
                isActivityLoading
                  ? "로딩 중..."
                  : isActivityError
                    ? "데이터를 불러오지 못했습니다."
                    : undefined
              }
            />

            <MyActivitySectionBoard
              title="좋아요"
              count={activityData?.likeCount ?? 0}
              icon={<Heart size={18} />}
              items={isActivityLoading || isActivityError ? [] : myLikeItems}
              onMoreClick={() => handleMoreClick("likes")}
              statusMessage={
                isActivityLoading
                  ? "로딩 중..."
                  : isActivityError
                    ? "데이터를 불러오지 못했습니다."
                    : undefined
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
