import { useRef } from "react";

import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import logoImage from "@/assets/Logo.svg";
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
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const authButtonClassName = "h-9 px-3 shrink-0 whitespace-nowrap";

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

  const handleSearchSubmit = (e: { preventDefault(): void }) => {
    e.preventDefault();
    const keyword = searchInputRef.current?.value.trim() ?? "";
    if (!keyword) {
      toast.error("검색어를 입력해 주세요.");
      return;
    }
    navigate(`/search?keyword=${encodeURIComponent(keyword)}`);
  };

  return (
    <header
      className={cn(
        "h-16 w-full overflow-hidden bg-white/90 shadow-[0px_4px_20px_0px_rgba(0,0,0,0.04)] backdrop-blur-[100px]",
        className,
      )}
    >
      <div className="mx-auto flex h-full w-full max-w-[1440px] min-w-[1220px] items-center justify-between px-10 gap-4">
        <div className="flex items-center gap-8 shrink-0">
          <a aria-label="Comit 홈으로 이동" href="/" className="shrink-0">
            <img
              alt="Comit 로고"
              className="h-7 w-auto object-contain mb-2 shrink-0"
              src={logoImage}
            />
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

        <div className="flex flex-1 items-center justify-end gap-6 min-w-0">
          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-1 min-w-[120px] max-w-[417px]"
          >
            <SearchInput
              ref={searchInputRef}
              aria-label="게시글 검색"
              className="border-border-deactivated min-w-0 bg-gray-50 text-label-04 text-text-primary placeholder:text-text-placeholder"
              containerClassName="w-full"
              placeholder="검색어를 입력하세요"
            />
          </form>

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
