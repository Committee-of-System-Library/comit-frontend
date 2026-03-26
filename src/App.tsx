import { BrowserRouter, Routes, Route } from "react-router";

import { AppDesktopShell } from "@/app/layout/AppDesktopShell";
import EventBoardPage from "@/pages/board/EventBoardPage";
import FreeBoardPage from "@/pages/board/FreeBoardPage";
import InfoBoardPage from "@/pages/board/InfoBoardPage";
import NoticeBoardPage from "@/pages/board/NoticeBoardPage";
import QnABoardPage from "@/pages/board/QnABoardPage";
import HomePage from "@/pages/home/HomePage";
import WritePage from "@/pages/write/WritePage";

function App() {
  const isWritePath = /^\/write\/?$/.test(window.location.pathname);

  return (
    <AppDesktopShell
      mainClassName={
        isWritePath
          ? "min-w-[1200px] max-w-[1440px] px-80 pt-4 pb-20 space-y-10"
          : undefined
      }
      rightRail={isWritePath ? null : undefined}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/write" element={<WritePage />} />
          <Route path="board/qna" element={<QnABoardPage />} />
          <Route path="board/info" element={<InfoBoardPage />} />
          <Route path="board/free" element={<FreeBoardPage />} />
          <Route path="/notice" element={<NoticeBoardPage />} />
          <Route path="/event" element={<EventBoardPage />} />
        </Routes>
      </BrowserRouter>
    </AppDesktopShell>
  );
}

export default App;
