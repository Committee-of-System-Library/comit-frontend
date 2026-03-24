import { BrowserRouter, Routes, Route } from "react-router";

import { AppDesktopShell } from "@/app/layout/AppDesktopShell";
import EventBoardPage from "@/pages/board/EventBoardPage";
import FreeBoardPage from "@/pages/board/FreeBoardPage";
import InfoBoardPage from "@/pages/board/InfoBoardPage";
import NoticeBoardPage from "@/pages/board/NoticeBoardPage";
import QnABoardPage from "@/pages/board/QnABoardPage";
import HomePage from "@/pages/home/HomePage";

function App() {
  return (
    <AppDesktopShell>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/qna" element={<QnABoardPage />} />
          <Route path="/info" element={<InfoBoardPage />} />
          <Route path="/free" element={<FreeBoardPage />} />
          <Route path="/notice" element={<NoticeBoardPage />} />
          <Route path="/event" element={<EventBoardPage />} />
        </Routes>
      </BrowserRouter>
    </AppDesktopShell>
  );
}

export default App;
