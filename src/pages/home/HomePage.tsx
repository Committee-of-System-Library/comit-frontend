import { Button } from "@/shared/ui/button/Button";
import { SearchInput } from "@/shared/ui/input/SearchInput";
import { TextBadge } from "@/shared/ui/text/TextBadge";
import { Footer } from "@/widgets/footer/Footer";
import { Header } from "@/widgets/header/Header";

const HomePage = () => (
  <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900">
    <Header isAuthenticated />
    <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-6 px-6 py-8">
      <section className="rounded-2xl border border-gray-200 bg-white p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Universal 공통 컴포넌트 프리뷰
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Header/Footer와 기본 UI 컴포넌트(버튼, 텍스트 배지, 검색 인풋)를 1차
          구현한 화면입니다.
        </p>
      </section>

      <section className="grid grid-cols-3 gap-4">
        <article className="space-y-3 rounded-2xl border border-gray-200 bg-white p-5">
          <h2 className="text-sm font-bold text-gray-700">Text Badge</h2>
          <div className="flex gap-2">
            <TextBadge variant="primary">텍스트</TextBadge>
            <TextBadge>텍스트</TextBadge>
          </div>
        </article>

        <article className="space-y-3 rounded-2xl border border-gray-200 bg-white p-5">
          <h2 className="text-sm font-bold text-gray-700">Button</h2>
          <div className="flex flex-wrap gap-2">
            <Button>버튼</Button>
            <Button variant="secondary">버튼</Button>
            <Button disabled>버튼</Button>
          </div>
        </article>

        <article className="space-y-3 rounded-2xl border border-gray-200 bg-white p-5">
          <h2 className="text-sm font-bold text-gray-700">Search Input</h2>
          <SearchInput
            aria-label="프리뷰 검색"
            placeholder="검색어를 입력하세요"
          />
          <SearchInput
            aria-label="포커스 상태 프리뷰 검색"
            defaultValue="입력중..."
            placeholder="검색어를 입력하세요"
          />
        </article>
      </section>
    </main>
    <Footer />
  </div>
);

export default HomePage;
