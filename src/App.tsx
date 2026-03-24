import { AppDesktopShell } from "@/app/layout/AppDesktopShell";
import HomePage from "@/pages/home/HomePage";
import WritePage from "@/pages/write/WritePage";

function App() {
  const isWritePath = /^\/write\/?$/.test(window.location.pathname);

  return (
    <AppDesktopShell
      mainClassName={isWritePath ? "space-y-0" : undefined}
      rightRail={isWritePath ? null : undefined}
    >
      {isWritePath ? <WritePage /> : <HomePage />}
    </AppDesktopShell>
  );
}

export default App;
