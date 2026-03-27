import { useEffect, useState } from "react";

import { AuthStateDevTool } from "@/app/devtools/AuthStateDevTool";
import { AppDesktopShell } from "@/app/layout/AppDesktopShell";
import HomePage from "@/pages/home/HomePage";
import WritePage from "@/pages/write/WritePage";

const DEV_AUTH_STORAGE_KEY = "comit.dev.authenticated";

const getInitialAuthState = () => {
  if (!import.meta.env.DEV) {
    return false;
  }

  return window.localStorage.getItem(DEV_AUTH_STORAGE_KEY) === "true";
};

function App() {
  const isWritePath = /^\/write\/?$/.test(window.location.pathname);
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
      <AppDesktopShell
        isAuthenticated={isAuthenticated}
        mainClassName={isWritePath ? "max-w-[792px] pt-10 pb-20" : undefined}
        rightRail={isWritePath ? null : undefined}
      >
        {isWritePath ? <WritePage /> : <HomePage />}
      </AppDesktopShell>

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
