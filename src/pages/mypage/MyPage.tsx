import { FileText, Heart, MessageCircleMore } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useMyProfileQuery } from "@/features/member/model/useMyProfileQuery";
import { useUpdateNicknameMutation } from "@/features/member/model/useUpdateNicknameMutation";
import { likedPosts } from "@/mocks/likedPosts";
import { myComments } from "@/mocks/myComments";
import { myPosts } from "@/mocks/myPosts";
import { LogoutButton } from "@/shared/ui/LogoutButton/LogoutButton";
import { StudentNumberVisibilityToggle } from "@/shared/ui/StudentNumberVisibilityToggle/StudentNumberVisibilityToggle";
import { MyActivitySectionBoard } from "@/widgets/mypage/MyActivitySectionBoard/MyActivitySectionBoard";
import { ProfileWidget } from "@/widgets/mypage/ProfileWidget/ProfileWidget";

const MyPage = () => {
  const navigate = useNavigate();
  const { data: profile } = useMyProfileQuery();
  const { mutate: updateNickname } = useUpdateNicknameMutation();

  const handleProfileSave = ({
    userName,
  }: {
    userName: string;
    imageFile: File | null;
  }) => {
    updateNickname(userName);
  };

  const handleLogout = () => {};

  const handleMoreClick = (category: "posts" | "comments" | "likes") => {
    navigate("/mypage/activity", { state: { category } });
  };

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
              key={profile?.id}
              studentNumber={profile?.studentNumber ?? ""}
              initialVisible={profile?.studentNumberVisible ?? false}
              onToggle={() => {}}
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
              count={32}
              icon={<FileText size={18} />}
              items={myPosts}
              onMoreClick={() => handleMoreClick("posts")}
            />

            <MyActivitySectionBoard
              title="내가 쓴 댓글"
              count={64}
              icon={<MessageCircleMore size={18} />}
              items={myComments}
              onMoreClick={() => handleMoreClick("comments")}
            />

            <MyActivitySectionBoard
              title="좋아요"
              count={10}
              icon={<Heart size={18} />}
              items={likedPosts}
              onMoreClick={() => handleMoreClick("likes")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
