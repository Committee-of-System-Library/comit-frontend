import { PostBoardPage } from "@/pages/board/PostBoardPage";

const NoticeBoardPage = () => {
  return <PostBoardPage boardType="NOTICE" title="공지사항" useAdminCard />;
};

export default NoticeBoardPage;
