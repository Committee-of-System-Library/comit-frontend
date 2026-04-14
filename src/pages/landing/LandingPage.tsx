import { useEffect, useRef, useState, type ReactNode } from "react";

import landingHeroLaptopImage from "@/assets/landing/Device - Macbook Pro.svg";
import section2CardAImage from "@/assets/landing/section2-card-a.png";
import section2CardBImage from "@/assets/landing/section2-card-b.png";
import section3Card1Image from "@/assets/landing/section3-card-1.png";
import section3Card2Image from "@/assets/landing/section3-card-2.png";
import section3Card3Image from "@/assets/landing/section3-card-3.png";
import section3Card4Image from "@/assets/landing/section3-card-4.png";
import logoImage from "@/assets/Logo.svg";
import mascotImage from "@/assets/Ori_Jump.svg";
import { getSsoLoginUrl } from "@/entities/auth/api/logout";
import { WritingButton } from "@/shared/ui/WritingButton/WritingButton";

const handleStartSsoLogin = () => {
  const redirectUri =
    typeof window !== "undefined" ? window.location.origin : undefined;
  window.location.assign(getSsoLoginUrl({ redirectUri }));
};

const FeatureRow = ({
  description,
  direction = "left",
  imageAlt,
  imageSrc,
  isVisible = false,
  title,
}: {
  description: ReactNode;
  direction?: "left" | "right";
  imageAlt: string;
  imageSrc: string;
  isVisible?: boolean;
  title: ReactNode;
}) => (
  <article
    className={`w-full rounded-xl bg-primary-50 px-6 py-8 transition-all duration-700 ease-out md:px-10 xl:h-[406px] xl:px-[102px] xl:py-[37px] ${
      isVisible
        ? "translate-x-0 opacity-100"
        : direction === "left"
          ? "-translate-x-16 opacity-0"
          : "translate-x-16 opacity-0"
    }`}
  >
    <div className="grid grid-cols-1 items-center gap-8 xl:h-full xl:grid-cols-[486px_minmax(0,1fr)] xl:gap-20">
      <div className="h-[240px] overflow-hidden rounded-xl md:h-[300px] xl:h-[332px]">
        <img
          alt={imageAlt}
          className="h-full w-full object-cover object-top"
          src={imageSrc}
        />
      </div>
      <div className="space-y-5 xl:max-w-[430px]">
        <h2 className="text-head-02 text-text-primary">{title}</h2>
        <p className="text-subtitle-01 text-text-tertiary">{description}</p>
      </div>
    </div>
  </article>
);

const BoardPreviewCard = ({ imageAlt, imageSrc }: BoardPreviewCardProps) => (
  <div className="h-[298px] overflow-hidden rounded-xl border-2 border-primary-200 bg-background-light">
    <img
      alt={imageAlt}
      className="h-full w-full object-cover object-top"
      src={imageSrc}
    />
  </div>
);

interface BoardPreviewCardProps {
  imageAlt: string;
  imageSrc: string;
}

const HeroLaptopPreview = () => (
  <div className="h-auto w-full max-w-[900px] justify-self-end xl:translate-x-16 xl:translate-y-6">
    <img
      alt="Comit 노트북 미리보기"
      className="h-full w-full object-contain xl:origin-right"
      src={landingHeroLaptopImage}
      style={{ animation: "landing-float 2.7s ease-in-out infinite" }}
    />
  </div>
);

const LandingPage = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isFeatureSectionVisible, setIsFeatureSectionVisible] = useState(false);
  const [isFinalCtaVisible, setIsFinalCtaVisible] = useState(false);

  const featureSectionRef = useRef<HTMLElement | null>(null);
  const finalCtaRef = useRef<HTMLElement | null>(null);

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (
            entry.target === featureSectionRef.current &&
            entry.isIntersecting
          ) {
            setIsFeatureSectionVisible(true);
          }

          if (entry.target === finalCtaRef.current && entry.isIntersecting) {
            setIsFinalCtaVisible(true);
          }
        });
      },
      { root: null, threshold: 0.25 },
    );

    if (featureSectionRef.current) {
      observer.observe(featureSectionRef.current);
    }

    if (finalCtaRef.current) {
      observer.observe(finalCtaRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-background-dark">
      <div className="fixed inset-x-0 top-0 z-40">
        <div
          aria-label="랜딩 진행률"
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={Math.round(scrollProgress)}
          className="h-1.5 w-full bg-gray-200"
          role="progressbar"
        >
          <div
            className="h-full bg-primary-600 transition-[width] duration-150 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1440px]">
        <section className="flex min-h-screen items-center px-6 py-16 md:px-10 xl:px-[120px] 2xl:px-[170px]">
          <div className="w-full">
            <div className="grid grid-cols-1 items-center gap-10 xl:grid-cols-[560px_minmax(0,1fr)] xl:gap-4">
              <div className="flex w-full justify-center xl:justify-start">
                <div className="flex w-full max-w-[560px] flex-col items-center text-center">
                  <img
                    alt="Comit 로고"
                    className="mx-auto h-[65.6px] w-[200px] object-contain"
                    src={logoImage}
                  />
                  <h1 className="mt-7 text-center text-head-01 text-text-primary">
                    <span className="whitespace-nowrap">
                      경북대학교 컴퓨터학부만의 이야기,
                    </span>
                    <br />
                    <span className="whitespace-nowrap">
                      우리들의 소통 공간
                    </span>
                  </h1>
                  <WritingButton
                    className="mx-auto mt-10 h-[46px] w-[104px] rounded-xl px-6"
                    fullWidth={false}
                    icon={null}
                    onClick={handleStartSsoLogin}
                    variant="action"
                  >
                    시작하기
                  </WritingButton>
                </div>
              </div>
              <HeroLaptopPreview />
            </div>
          </div>
        </section>

        <div className="px-6 pb-24 pt-6 md:px-10 xl:px-[120px] xl:pb-[160px] xl:pt-10 2xl:px-[170px]">
          <section
            className="mt-20 space-y-8 xl:mt-[120px] xl:space-y-20"
            ref={featureSectionRef}
          >
            <FeatureRow
              description={
                <>
                  <span className="whitespace-nowrap">
                    시도위에서 학생들의 정보를 받아오기 때문에
                  </span>
                  <br />
                  <span className="whitespace-nowrap">
                    빠르게 시작해볼 수 있어요
                  </span>
                </>
              }
              direction="left"
              imageAlt="학교 계정 연동 안내 화면"
              imageSrc={section2CardBImage}
              isVisible={isFeatureSectionVisible}
              title={
                <>
                  <span className="whitespace-nowrap">학교 계정만 있다면</span>
                  <br />
                  <span className="whitespace-nowrap">
                    별도의 회원가입 절차 없이 사용할 수 있어요
                  </span>
                </>
              }
            />
            <FeatureRow
              description={
                <>
                  <span className="whitespace-nowrap">
                    외부인은 기능이 제한되기 때문에
                  </span>
                  <br />
                  <span className="whitespace-nowrap">
                    우리끼리 신뢰도 있는 이야기를 주고받을 수 있어요
                  </span>
                </>
              }
              direction="right"
              imageAlt="컴퓨터학부 인증 안내 화면"
              imageSrc={section2CardAImage}
              isVisible={isFeatureSectionVisible}
              title={
                <>
                  <span className="whitespace-nowrap">
                    경북대학교 컴퓨터학부 학생들끼리
                  </span>
                  <br />
                  <span className="whitespace-nowrap">
                    신뢰도 있는 정보를 주고 받을 수 있어요
                  </span>
                </>
              }
            />
          </section>

          <section className="relative mt-20 rounded-xl bg-primary-50 px-6 py-10 md:px-10 xl:mt-[134px] xl:px-[102px] xl:py-[92px]">
            <p className="text-head-01 text-text-primary">
              <span className="whitespace-nowrap">다양한 게시판을 통해</span>
              <br />
              <span className="whitespace-nowrap">즐겁게 소통할 수 있어요</span>
            </p>

            <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
              <BoardPreviewCard
                imageAlt="정보게시판 미리보기"
                imageSrc={section3Card1Image}
              />
              <BoardPreviewCard
                imageAlt="Q&A 게시판 미리보기"
                imageSrc={section3Card2Image}
              />
              <BoardPreviewCard
                imageAlt="자유게시판 미리보기"
                imageSrc={section3Card3Image}
              />
              <BoardPreviewCard
                imageAlt="이벤트 게시판 미리보기"
                imageSrc={section3Card4Image}
              />
            </div>

            <img
              alt="Comit 마스코트"
              className="pointer-events-none absolute right-6 bottom-4 h-[220px] w-[160px] object-contain md:right-8 md:bottom-6 md:h-[260px] md:w-[190px] xl:right-[5px] xl:bottom-[-20px] xl:h-[310px] xl:w-[222px]"
              src={mascotImage}
            />
          </section>

          <section
            className={`mt-28 flex flex-col items-center gap-6 transition-all duration-700 ease-out xl:mt-[220px] ${
              isFinalCtaVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
            ref={finalCtaRef}
          >
            <p className="text-center text-[40px] leading-[1.2] font-bold text-text-primary">
              지금 시작해 볼까요?
            </p>
            <WritingButton
              className="h-[46px] min-w-[274px] rounded-xl px-6"
              fullWidth={false}
              icon={null}
              onClick={handleStartSsoLogin}
              variant="action"
            >
              지금 바로 Comit의 세계로 빠져들기
            </WritingButton>
          </section>
        </div>
      </div>
    </main>
  );
};

export default LandingPage;
