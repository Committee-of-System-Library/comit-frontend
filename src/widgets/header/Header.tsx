import { Button } from "@/shared/ui/button/Button";
import { SearchInput } from "@/shared/ui/input/SearchInput";
import { cn } from "@/utils/cn";

type HeaderNavItem = {
  href: string;
  isActive?: boolean;
  label: string;
};

const defaultNavItems: HeaderNavItem[] = [
  { href: "/", isActive: true, label: "홈" },
  { href: "/board/qna", label: "Q&A" },
  { href: "/board/info", label: "정보게시판" },
  { href: "/board/free", label: "자유게시판" },
  { href: "/notice", label: "공지사항" },
  { href: "/event", label: "이벤트" },
];

export interface HeaderProps {
  className?: string;
  isAuthenticated?: boolean;
  navItems?: HeaderNavItem[];
}

export const Header = ({
  className,
  isAuthenticated = false,
  navItems = defaultNavItems,
}: HeaderProps) => {
  const handlePrimaryActionClick = () => {
    if (isAuthenticated) {
      window.location.href = "/write";
    }
  };

  return (
    <header
      className={cn("w-full border-b border-gray-200 bg-white", className)}
    >
      <div className="mx-auto flex w-full max-w-[1440px] items-center gap-6 px-6 py-4">
        <a
          aria-label="Comit 홈으로 이동"
          className="text-head-02 text-gray-900 transition-opacity hover:opacity-80"
          href="/"
        >
          로고
        </a>

        <nav
          aria-label="주요 메뉴"
          className="flex min-w-fit items-center gap-6"
        >
          {navItems.map((item) => (
            <a
              key={item.label}
              className={cn(
                "text-label-04 font-medium transition-colors hover:text-gray-900",
                item.isActive ? "text-gray-900" : "text-gray-600",
              )}
              href={item.href}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <SearchInput
          aria-label="게시글 검색"
          containerClassName="ml-auto w-full max-w-[420px]"
          placeholder="검색어를 입력하세요"
        />

        <div className="flex items-center gap-2">
          <Button variant="secondary">
            {isAuthenticated ? "마이페이지" : "회원가입"}
          </Button>
          <Button onClick={handlePrimaryActionClick}>
            {isAuthenticated ? "글쓰기" : "로그인"}
          </Button>
        </div>
      </div>
    </header>
  );
};
