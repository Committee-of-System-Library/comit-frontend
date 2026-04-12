import { useEffect, useState } from "react";

import mascotImage from "@/assets/Ori_happy.svg";
import { getSsoLoginUrl } from "@/entities/auth/api/logout";
import { WritingButton } from "@/shared/ui/WritingButton/WritingButton";
import { cn } from "@/utils/cn";

const handleStartSsoLogin = () => {
  const redirectUri =
    typeof window !== "undefined" ? window.location.origin : undefined;
  window.location.assign(getSsoLoginUrl({ redirectUri }));
};

const PlaceholderBlock = ({ className = "" }: { className?: string }) => (
  <div className={cn("bg-black", className)} />
);

const LandingPage = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTop =
        window.scrollY || document.documentElement.scrollTop || 0;
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      if (scrollableHeight <= 0) {
        setScrollProgress(0);
        return;
      }

      const nextProgress = Math.min((scrollTop / scrollableHeight) * 100, 100);
      setScrollProgress(nextProgress);
    };

    let frameId = 0;
    const handleScroll = () => {
      if (frameId) {
        return;
      }

      frameId = window.requestAnimationFrame(() => {
        updateScrollProgress();
        frameId = 0;
      });
    };

    updateScrollProgress();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateScrollProgress);

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }

      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateScrollProgress);
    };
  }, []);

  return (
    <main className="min-h-screen w-full bg-background-dark">
      <div className="fixed inset-x-0 top-0 z-40">
        <div
          aria-label="랜딩 진행률"
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={Math.round(scrollProgress)}
          className="h-2.5 w-full bg-gray-200"
          role="progressbar"
        >
          <div
            className="h-full bg-primary-600 transition-[width] duration-150 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1440px]">
        <div className="px-[120px] pb-[160px] pt-[209px]">
          <section className="flex flex-col items-center">
            <div className="text-center">
              <p className="text-head-03 text-primary-600">comit</p>
              <h1 className="mt-2 text-center text-head-01 text-text-primary">
                경북대학교 컴퓨터학부만의 이야기,
                <br />
                우리들의 소통 공간
              </h1>
            </div>

            <WritingButton
              className="mt-10 h-[46px] rounded-xl px-6 text-label-01"
              fullWidth={false}
              icon={null}
              onClick={handleStartSsoLogin}
              variant="action"
            >
              시작하기
            </WritingButton>

            <PlaceholderBlock className="mt-[83px] h-[465px] w-[792px]" />
          </section>

          <section className="mt-[159px] space-y-[120px]">
            <div className="grid grid-cols-[588px_1fr] items-center gap-6">
              <PlaceholderBlock className="h-[332px] w-[588px]" />
              <div className="space-y-6">
                <p className="text-head-03 text-text-primary">
                  경북대학교 컴퓨터학부 학생들끼리
                  <br />
                  신뢰도 있는 정보를 주고 받을 수 있어요
                </p>
                <p className="text-subtitle-01 text-text-secondary">
                  외부인은 기능이 제한되기 때문에
                  <br />
                  우리끼리 신뢰도 있는 이야기를 주고받을 수 있어요
                </p>
              </div>
            </div>

            <div className="grid grid-cols-[588px_1fr] items-center gap-6">
              <PlaceholderBlock className="h-[332px] w-[588px]" />
              <div className="space-y-6">
                <p className="text-head-03 text-text-primary">
                  학교 계정만 있다면
                  <br />
                  별도의 회원가입 절차 없이 사용할 수 있어요
                </p>
                <p className="text-subtitle-01 text-text-secondary">
                  시도위에서 학생들의 정보를 받아오기 때문에
                  <br />
                  빠르게 시작해볼 수 있어요
                </p>
              </div>
            </div>
          </section>

          <section className="mt-[134px]">
            <p className="text-head-03 text-text-primary">
              다양한 게시판을 통해
              <br />
              즐겁게 소통할 수 있어요
            </p>

            <div className="mt-7 grid grid-cols-2 gap-6">
              <PlaceholderBlock className="h-[298px] w-[486px]" />
              <PlaceholderBlock className="h-[298px] w-[486px]" />
              <PlaceholderBlock className="h-[298px] w-[486px]" />
              <PlaceholderBlock className="h-[298px] w-[486px]" />
            </div>
          </section>

          <section className="mt-[340px] flex items-end justify-center gap-10">
            <div className="flex flex-col items-center gap-6">
              <p className="text-center text-head-01 text-text-primary">
                지금 시작해 볼까요?
              </p>
              <WritingButton
                className="h-[46px] min-w-[274px] rounded-xl px-6 text-label-01"
                fullWidth={false}
                icon={null}
                onClick={handleStartSsoLogin}
                variant="action"
              >
                지금 바로 Comit의 세계로 빠져들기
              </WritingButton>
            </div>

            <img
              alt="Comit 마스코트"
              className="h-[221px] w-[158px] object-contain"
              src={mascotImage}
            />
          </section>
        </div>
      </div>
    </main>
  );
};

export default LandingPage;
