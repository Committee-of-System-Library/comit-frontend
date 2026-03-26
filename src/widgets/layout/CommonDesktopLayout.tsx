import type { ReactNode } from "react";

import { cn } from "@/utils/cn";
import { Footer, type FooterProps } from "@/widgets/footer/Footer";
import { Header, type HeaderProps } from "@/widgets/header/Header";

export interface CommonDesktopLayoutProps {
  children: ReactNode;
  topBanner?: ReactNode;
  className?: string;
  contentClassName?: string;
  footerProps?: FooterProps;
  headerProps?: HeaderProps;
  mainClassName?: string;
  rightRail?: ReactNode | null;
}

export const CommonDesktopLayout = ({
  children,
  topBanner,
  className,
  contentClassName,
  footerProps,
  headerProps,
  mainClassName,
  rightRail,
}: CommonDesktopLayoutProps) => {
  const hasRightRail = Boolean(rightRail);
  const responsiveRightRailClassName = hasRightRail ? "min-[1024px]:block" : "";

  return (
    <div
      className={cn(
        "flex min-h-screen flex-col bg-background-dark text-text-primary",
        className,
      )}
    >
      <Header {...headerProps} />
      <main
        className={cn(
          "mx-auto flex w-full max-w-[1920px] flex-1 flex-col items-center px-4 py-6 min-[1200px]:px-6",
          contentClassName,
        )}
      >
        <div className="w-full max-w-[1200px] flex flex-col gap-10">
          {topBanner && <div className="w-full">{topBanner}</div>}

          {hasRightRail ? (
            <div className="grid w-full grid-cols-1 items-start gap-6 min-[1024px]:grid-cols-[minmax(0,1fr)_282px]">
              <section
                className={cn("min-w-0 w-full space-y-9", mainClassName)}
              >
                {children}
              </section>
              <aside
                className={cn(
                  "hidden w-[282px] shrink-0",
                  responsiveRightRailClassName,
                )}
              >
                <div className="sticky top-6">{rightRail}</div>
              </aside>
            </div>
          ) : (
            <section
              className={cn(
                "w-full max-w-[1040px] mx-auto min-w-0 space-y-4",
                mainClassName,
              )}
            >
              {children}
            </section>
          )}
        </div>
      </main>
      <Footer {...footerProps} />
    </div>
  );
};
