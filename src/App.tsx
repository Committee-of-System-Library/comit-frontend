import { useEffect, useState } from "react";

import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";

import { AuthStateDevTool } from "@/app/devtools/AuthStateDevTool";
import { AppDesktopShell } from "@/app/layout/AppDesktopShell";
import { mockBannerItems } from "@/mocks/bannerItems";
import EventBoardPage from "@/pages/board/EventBoardPage";
import FreeBoardPage from "@/pages/board/FreeBoardPage";
import InfoBoardPage from "@/pages/board/InfoBoardPage";
import NoticeBoardPage from "@/pages/board/NoticeBoardPage";
import QnABoardPage from "@/pages/board/QnABoardPage";
import HomePage from "@/pages/home/HomePage";
import LoginPage from "@/pages/login/LoginPage";
import MyPage from "@/pages/mypage/MyPage";
import PostPage from "@/pages/PostPage";
import WritePage from "@/pages/write/WritePage";
import { Banner } from "@/widgets/home/Banner/Banner";

const DEV_AUTH_STORAGE_KEY = "comit.dev.authenticated";

const getInitialAuthState = () => {
  if (!import.meta.env.DEV) {
    return false;
  }

  return window.localStorage.getItem(DEV_AUTH_STORAGE_KEY) === "true";
};

interface AppContentProps {
  isAuthenticated: boolean;
}

const AppContent = ({ isAuthenticated }: AppContentProps) => {
  const { pathname } = useLocation();
  const isWritePath = /^\/write\/?$/.test(pathname);
  const isMainPage = pathname === "/";
  const isTitleBoardPage =
    /^\/board\/(qna|info|free)\/?$/.test(pathname) ||
    /^\/(notice|event)\/?$/.test(pathname);

  return (
    <AppDesktopShell
      isAuthenticated={isAuthenticated}
      mainClassName={isWritePath ? "max-w-[792px] pt-10 pb-20" : undefined}
      rightRailClassName={isTitleBoardPage ? "pt-[90px]" : undefined}
      rightRail={isWritePath ? null : undefined}
      topBanner={isMainPage ? <Banner items={mockBannerItems} /> : undefined}
    >
      <Routes>
        <Route element={<HomePage />} path="/" />
        <Route element={<WritePage />} path="/write" />
        <Route element={<QnABoardPage />} path="/board/qna" />
        <Route element={<InfoBoardPage />} path="/board/info" />
        <Route element={<FreeBoardPage />} path="/board/free" />
        <Route element={<NoticeBoardPage />} path="/notice" />
        <Route element={<EventBoardPage />} path="/event" />
        <Route element={<PostPage />} path="/post" />
        <Route element={<LoginPage />} path="/login" />
        <Route element={<MyPage />} path="/mypage" />
      </Routes>
    </AppDesktopShell>
  );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] =
    useState<boolean>(getInitialAuthState);

  useEffect(() => {
    if (!import.meta.env.DEV) {
      return;
    }

    window.localStorage.setItem(DEV_AUTH_STORAGE_KEY, String(isAuthenticated));
  }, [isAuthenticated]);

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
        <AppContent isAuthenticated={isAuthenticated} />
      </BrowserRouter>

      {import.meta.env.DEV ? (
        <AuthStateDevTool
          isAuthenticated={isAuthenticated}
          onChange={setIsAuthenticated}
        />
      ) : null}
    </>
  );
}

export default App;
