import { mockFreePosts } from "@/mocks/freePosts";
import { mockInfoPosts } from "@/mocks/infoPosts";
import { mockQnAPosts } from "@/mocks/qnaPosts";
import { SectionBoard } from "@/widgets/home/SectionBoard/SectionBoard";

const HomePage = () => {
  return (
    <div className="flex flex-col gap-9 w-full">
      <SectionBoard title="Q&A" posts={mockQnAPosts.slice(0, 5)} />

      <div className="flex gap-6 w-full">
        <div className="flex-1 min-w-0">
          <SectionBoard title="정보게시판" posts={mockInfoPosts.slice(0, 3)} />
        </div>
        <div className="flex-1 min-w-0">
          <SectionBoard title="자유게시판" posts={mockFreePosts.slice(0, 3)} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
