import { AppDesktopShell } from "@/app/layout/AppDesktopShell";
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
      {isWritePath ? <WritePage /> : <HomePage />}
    </AppDesktopShell>
  );
}

export default App;
