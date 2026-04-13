import { useEffect, useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { Toaster, toast } from "react-hot-toast";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { DevToolDock } from "@/app/devtools/DevToolDock";
import { AppDesktopShell } from "@/app/layout/AppDesktopShell";
import { useMyProfileQuery } from "@/features/member/model/useMyProfileQuery";
import { mockBannerItems } from "@/mocks/bannerItems";
import AdminApp from "@/pages/admin/AdminApp";
import EventBoardPage from "@/pages/board/EventBoardPage";
import FreeBoardPage from "@/pages/board/FreeBoardPage";
import InfoBoardPage from "@/pages/board/InfoBoardPage";
import NoticeBoardPage from "@/pages/board/NoticeBoardPage";
import QnABoardPage from "@/pages/board/QnABoardPage";
import HomePage from "@/pages/home/HomePage";
import LandingPage from "@/pages/landing/LandingPage";
import MyActivityPage from "@/pages/mypage/MyActivityPage";
import MyPage from "@/pages/mypage/MyPage";
import PostPage from "@/pages/PostPage";
import WritePage from "@/pages/write/WritePage";
import { queryKeys } from "@/shared/api/query-keys";
import { Banner } from "@/widgets/home/Banner/Banner";
import { SignupGuideModal } from "@/widgets/signup/SignupGuideModal";

const DEV_CSE_STUDENT_STORAGE_KEY = "comit.dev.cse.student";

const getInitialCseStudentState = () => {
  if (!import.meta.env.DEV) {
    return true;
  }

  const storedValue = window.localStorage.getItem(DEV_CSE_STUDENT_STORAGE_KEY);

  if (storedValue === null) {
    return true;
  }

  return storedValue === "true";
};

interface AppContentProps {
  isAuthChecking: boolean;
  isCseStudent: boolean;
  isAuthenticated: boolean;
}

const isNonCseSsoError = (reason: string | null, errorCode: string | null) => {
  const token = `${errorCode ?? ""} ${reason ?? ""}`.toLowerCase();

  const nonCseHints = [
    "unauthorized",
    "not_cse",
    "not-cse",
    "non_cse",
    "non-cse",
    "school email",
    "email domain",
    "학교 이메일",
    "컴퓨터학부",
  ];

  return nonCseHints.some((hint) => token.includes(hint));
};

const isRestrictedAccountSsoError = (
  reason: string | null,
  errorCode: string | null,
) => {
  const token = `${errorCode ?? ""} ${reason ?? ""}`.toLowerCase();

  const restrictedHints = [
    "external_user",
    "external-user",
    "external user",
    "forbidden",
    "403",
  ];

  return restrictedHints.some((hint) => token.includes(hint));
};

const AppContent = ({
  isAuthChecking,
  isCseStudent,
  isAuthenticated,
}: AppContentProps) => {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isWritePath = /^\/write\/?$/.test(pathname);
  const isMyPage = pathname.startsWith("/mypage");
  const isMainPage = pathname === "/";
  const isTitleBoardPage =
    /^\/board\/(qna|info|free)\/?$/.test(pathname) ||
    /^\/(notice|event)\/?$/.test(pathname);
  const queryParams = new URLSearchParams(search);
  const stage = queryParams.get("stage");
  const reason = queryParams.get("reason");
  const errorCode = queryParams.get("errorCode") ?? queryParams.get("code");
  const signupFlow = queryParams.get("signupFlow");
  const signupGuideMode = signupFlow === "register" ? "register" : "preview";
  const shouldShowSignupGuideModal =
    isMainPage &&
    queryParams.get("signupGuide") === "1" &&
    signupFlow === "register";

  useEffect(() => {
    if (!stage) {
      return;
    }

    if (stage === "success") {
      toast.success("로그인이 완료되었습니다.");
      queryClient.invalidateQueries({ queryKey: queryKeys.member.all });
      navigate("/", { replace: true });
      return;
    }

    if (stage === "register") {
      const nextParams = new URLSearchParams(search);
      nextParams.set("signupGuide", "1");
      nextParams.set("signupFlow", "register");
      nextParams.delete("stage");
      nextParams.delete("reason");

      navigate(
        {
          pathname: "/",
          search: `?${nextParams.toString()}`,
        },
        { replace: true },
      );
      return;
    }

    if (stage === "error") {
      const nonCseError = isNonCseSsoError(reason, errorCode);
      const restrictedError = isRestrictedAccountSsoError(reason, errorCode);

      if (nonCseError || restrictedError) {
        toast.error(
          "접근이 제한된 계정이거나 컴퓨터학부 계정으로 로그인해 주세요.",
        );
        navigate("/landing", { replace: true });
        return;
      }

      toast.error(
        reason || "SSO 인증 중 오류가 발생했습니다. 다시 시도해 주세요.",
      );
      const nextParams = new URLSearchParams(search);
      nextParams.delete("stage");
      nextParams.delete("reason");
      nextParams.delete("errorCode");
      nextParams.delete("code");

      navigate(
        {
          pathname: "/landing",
          search: nextParams.toString() ? `?${nextParams.toString()}` : "",
        },
        { replace: true },
      );
    }
  }, [errorCode, navigate, queryClient, reason, search, stage]);

  const handleCloseSignupGuideModal = () => {
    navigate("/landing", { replace: true });
  };

  if (isAuthChecking) {
    return (
      <main className="flex min-h-screen w-full items-center justify-center bg-background-dark px-4">
        <p className="text-body-01 text-text-tertiary">
          인증 상태를 확인하고 있습니다...
        </p>
      </main>
    );
  }

  if (!isAuthenticated) {
    if (shouldShowSignupGuideModal) {
      return (
        <SignupGuideModal
          isCseStudent={isCseStudent}
          mode={signupGuideMode}
          onClose={handleCloseSignupGuideModal}
          open
        />
      );
    }

    toast.error("로그인하여 서비스를 사용해주세요", { id: "auth-required" });
    navigate("/landing", { replace: true });

    return null;
  }

  return (
    <AppDesktopShell
      isAuthenticated={isAuthenticated}
      mainClassName={
        isWritePath
          ? "max-w-[792px] pt-10 pb-20"
          : isMyPage
            ? "max-w-[1200px] pt-10 pb-20"
            : undefined
      }
      rightRail={isWritePath || isMyPage ? null : undefined}
      rightRailClassName={isTitleBoardPage ? "pt-[90px]" : undefined}
      topBanner={isMainPage ? <Banner items={mockBannerItems} /> : undefined}
    >
      <>
        <Routes>
          <Route element={<HomePage />} path="/" />
          <Route element={<WritePage />} path="/write" />
          <Route element={<QnABoardPage />} path="/board/qna" />
          <Route element={<InfoBoardPage />} path="/board/info" />
          <Route element={<FreeBoardPage />} path="/board/free" />
          <Route element={<NoticeBoardPage />} path="/notice" />
          <Route element={<EventBoardPage />} path="/event" />
          <Route element={<PostPage />} path="/post/:postId" />
          <Route element={<MyPage />} path="/mypage" />
          <Route element={<MyActivityPage />} path="/mypage/activity" />
          <Route element={<Navigate replace to="/" />} path="*" />
        </Routes>
      </>
    </AppDesktopShell>
  );
};

function App() {
  const [isCseStudent, setIsCseStudent] = useState<boolean>(
    getInitialCseStudentState,
  );
  const { data: myProfile, isLoading: isMyProfileLoading } =
    useMyProfileQuery();
  const isAuthChecking = isMyProfileLoading;
  const isAuthenticated = Boolean(myProfile);

  useEffect(() => {
    if (!import.meta.env.DEV) {
      return;
    }

    window.localStorage.setItem(
      DEV_CSE_STUDENT_STORAGE_KEY,
      String(isCseStudent),
    );
  }, [isCseStudent]);

  const handlePreviewSignupGuide = () => {
    window.location.assign("/?signupGuide=1");
  };

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          className:
            "!bg-gray-800 !text-white !rounded-xl !px-4 !py-2 !text-caption-02 !shadow-md",
          success: {
            iconTheme: {
              primary: "#30D158",
              secondary: "#FFFFFF",
            },
          },
          error: {
            iconTheme: {
              primary: "#FF4245",
              secondary: "#FFFFFF",
            },
          },
          duration: 3000,
        }}
      />
      <BrowserRouter>
        <Routes>
          <Route element={<LandingPage />} path="/landing" />
          <Route element={<AdminApp />} path="/admin/*" />
          <Route
            element={
              <AppContent
                isAuthChecking={isAuthChecking}
                isAuthenticated={isAuthenticated}
                isCseStudent={isCseStudent}
              />
            }
            path="*"
          />
        </Routes>

        {import.meta.env.DEV ? (
          <DevToolDock
            isAuthenticated={isAuthenticated}
            isCseStudent={isCseStudent}
            onCseStudentChange={setIsCseStudent}
            onPreviewSignupGuide={handlePreviewSignupGuide}
          />
        ) : null}
      </BrowserRouter>
    </>
  );
}

export default App;
