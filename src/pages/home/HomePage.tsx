import { useNavigate } from "react-router-dom";

import { mapPostSummaryToSectionBoardPostItem } from "@/features/post/model/postUiMappers";
import { usePostListQuery } from "@/features/post/model/usePostListQuery";
import { SectionBoard } from "@/widgets/home/SectionBoard/SectionBoard";

const HomePage = () => {
  const navigate = useNavigate();
  const { data: qnaData } = usePostListQuery({
    boardType: "QNA",
    size: 5,
  });
  const { data: infoData } = usePostListQuery({
    boardType: "INFO",
    size: 3,
  });
  const { data: freeData } = usePostListQuery({
    boardType: "FREE",
    size: 3,
  });

  const qnaPosts = (qnaData?.posts ?? []).map(
    mapPostSummaryToSectionBoardPostItem,
  );
  const infoPosts = (infoData?.posts ?? []).map(
    mapPostSummaryToSectionBoardPostItem,
  );
  const freePosts = (freeData?.posts ?? []).map(
    mapPostSummaryToSectionBoardPostItem,
  );

  return (
    <div className="flex flex-col gap-9 w-full">
      <SectionBoard
        title="Q&A"
        posts={qnaPosts}
        onPostClick={(post) => navigate(`/post/${post.postId}`)}
        onViewAll={() => navigate("/board/qna")}
      />

      <div className="flex gap-6 w-full">
        <div className="flex-1 min-w-0">
          <SectionBoard
            title="정보게시판"
            posts={infoPosts}
            onPostClick={(post) => navigate(`/post/${post.postId}`)}
            onViewAll={() => navigate("/board/info")}
          />
        </div>
        <div className="flex-1 min-w-0">
          <SectionBoard
            title="자유게시판"
            posts={freePosts}
            onPostClick={(post) => navigate(`/post/${post.postId}`)}
            onViewAll={() => navigate("/board/free")}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
