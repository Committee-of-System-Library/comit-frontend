import { useEffect, useState } from "react";

import { Toaster } from "react-hot-toast";
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { DevToolDock } from "@/app/devtools/DevToolDock";
import { AppDesktopShell } from "@/app/layout/AppDesktopShell";
import { mockBannerItems } from "@/mocks/bannerItems";
import AdminApp from "@/pages/admin/AdminApp";
import EventBoardPage from "@/pages/board/EventBoardPage";
import FreeBoardPage from "@/pages/board/FreeBoardPage";
import InfoBoardPage from "@/pages/board/InfoBoardPage";
import NoticeBoardPage from "@/pages/board/NoticeBoardPage";
import QnABoardPage from "@/pages/board/QnABoardPage";
import HomePage from "@/pages/home/HomePage";
import LoginPage from "@/pages/login/LoginPage";
import MyActivityPage from "@/pages/mypage/MyActivityPage";
import MyPage from "@/pages/mypage/MyPage";
import PostPage from "@/pages/PostPage";
import WritePage from "@/pages/write/WritePage";
import { Banner } from "@/widgets/home/Banner/Banner";
import { SignupGuideModal } from "@/widgets/signup/SignupGuideModal";

const DEV_AUTH_STORAGE_KEY = "comit.dev.authenticated";
const DEV_CSE_STUDENT_STORAGE_KEY = "comit.dev.cse.student";

const getInitialAuthState = () => {
  if (!import.meta.env.DEV) {
    return false;
  }

  return window.localStorage.getItem(DEV_AUTH_STORAGE_KEY) === "true";
};

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
  isCseStudent: boolean;
  isAuthenticated: boolean;
}

const AppContent = ({ isCseStudent, isAuthenticated }: AppContentProps) => {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const isWritePath = /^\/write\/?$/.test(pathname);
  const isMyPage = pathname.startsWith("/mypage");
  const isMainPage = pathname === "/";
  const isTitleBoardPage =
    /^\/board\/(qna|info|free)\/?$/.test(pathname) ||
    /^\/(notice|event)\/?$/.test(pathname);
  const queryParams = new URLSearchParams(search);
  const shouldShowSignupGuideModal =
    isMainPage && queryParams.get("signupGuide") === "1";

  const handleCloseSignupGuideModal = () => {
    const nextParams = new URLSearchParams(search);
    nextParams.delete("signupGuide");
    nextParams.delete("oauth");

    navigate(
      {
        pathname,
        search: nextParams.toString() ? `?${nextParams.toString()}` : "",
      },
      { replace: true },
    );
  };

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
          <Route element={<LoginPage />} path="/login" />
          <Route element={<MyPage />} path="/mypage" />
          <Route element={<MyActivityPage />} path="/mypage/activity" />
        </Routes>
        {shouldShowSignupGuideModal ? (
          <SignupGuideModal
            isCseStudent={isCseStudent}
            onClose={handleCloseSignupGuideModal}
            open
          />
        ) : null}
      </>
    </AppDesktopShell>
  );
};

function App() {
  const [isCseStudent, setIsCseStudent] = useState<boolean>(
    getInitialCseStudentState,
  );
  const [isAuthenticated, setIsAuthenticated] =
    useState<boolean>(getInitialAuthState);

  useEffect(() => {
    if (!import.meta.env.DEV) {
      return;
    }

    window.localStorage.setItem(DEV_AUTH_STORAGE_KEY, String(isAuthenticated));
  }, [isAuthenticated]);

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
    window.location.assign("/?oauth=success&signupGuide=1");
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
          <Route element={<AdminApp />} path="/admin/*" />
          <Route
            element={
              <AppContent
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
            onChange={setIsAuthenticated}
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
