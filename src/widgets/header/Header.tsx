import { getSsoLoginUrl } from "@/entities/auth/api/logout";
import { Button } from "@/shared/ui/button/Button";
import { SearchInput } from "@/shared/ui/input/SearchInput";
import { cn } from "@/utils/cn";

type HeaderNavItem = {
  href: string;
  isActive?: boolean;
  label: string;
};

const defaultNavItems: HeaderNavItem[] = [
  { href: "/", label: "홈" },
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
  const authButtonClassName = "h-9 px-3";

  const currentPath = (() => {
    const normalizedPath = window.location.pathname.replace(/\/+$/, "");
    return normalizedPath.length > 0 ? normalizedPath : "/";
  })();

  const isNavItemActive = (item: HeaderNavItem) => {
    if (typeof item.isActive === "boolean") {
      return item.isActive;
    }

    if (item.href === "/") {
      return currentPath === "/";
    }

    return currentPath === item.href || currentPath.startsWith(`${item.href}/`);
  };

  const handleAuthActionClick = () => {
    if (isAuthenticated) {
      window.location.href = "/mypage";
      return;
    }

    const redirectUri =
      typeof window !== "undefined" ? window.location.origin : undefined;

    window.location.assign(getSsoLoginUrl({ redirectUri }));
  };

  return (
    <header
      className={cn(
        "h-16 w-full overflow-hidden bg-white/90 shadow-[0px_4px_20px_0px_rgba(0,0,0,0.04)] backdrop-blur-[100px]",
        className,
      )}
    >
      <div className="mx-auto flex h-full w-full max-w-[1440px] items-center justify-between px-10">
        <div className="flex items-center gap-8">
          <a
            aria-label="Comit 홈으로 이동"
            className="text-head-03 text-text-primary transition-opacity hover:opacity-80"
            href="/"
          >
            로고
          </a>

          <nav
            aria-label="주요 메뉴"
            className="flex min-w-fit items-center gap-2"
          >
            {navItems.map((item) => {
              const isActive = isNavItemActive(item);

              return (
                <a
                  key={item.label}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "inline-flex items-center rounded-lg px-3 py-2 text-label-04 transition-colors",
                    isActive
                      ? "bg-gray-50 text-primary-800"
                      : "text-text-deactivated hover:bg-gray-50 hover:text-primary-800",
                  )}
                  href={item.href}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center justify-end gap-6">
          <SearchInput
            aria-label="게시글 검색"
            className="border-border-deactivated bg-gray-50 text-label-04 text-text-primary placeholder:text-text-placeholder"
            containerClassName="w-full min-w-[240px] max-w-[417px]"
            placeholder="검색어를 입력하세요"
          />

          <div className="flex items-center">
            {isAuthenticated ? (
              <Button
                className={authButtonClassName}
                onClick={handleAuthActionClick}
                variant="secondary"
              >
                <span className="text-label-04 font-normal">마이페이지</span>
              </Button>
            ) : (
              <Button
                className={authButtonClassName}
                onClick={handleAuthActionClick}
                variant="primary"
              >
                <span className="text-label-04 font-normal">
                  로그인/회원가입
                </span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
