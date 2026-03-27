import { useEffect, useState } from "react";

import { BrowserRouter, Route, Routes, useLocation } from "react-router";

import { AuthStateDevTool } from "@/app/devtools/AuthStateDevTool";
import { AppDesktopShell } from "@/app/layout/AppDesktopShell";
import { mockBannerItems } from "@/mocks/bannerItems";
import EventBoardPage from "@/pages/board/EventBoardPage";
import FreeBoardPage from "@/pages/board/FreeBoardPage";
import InfoBoardPage from "@/pages/board/InfoBoardPage";
import NoticeBoardPage from "@/pages/board/NoticeBoardPage";
import QnABoardPage from "@/pages/board/QnABoardPage";
import HomePage from "@/pages/home/HomePage";
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

  return (
    <AppDesktopShell
      isAuthenticated={isAuthenticated}
      mainClassName={isWritePath ? "max-w-[792px] pt-10 pb-20" : undefined}
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
