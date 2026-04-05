import { useState } from "react";

import { Bug, ChevronDown, ShieldCheck } from "lucide-react";
import { useLocation } from "react-router-dom";

import { AuthStateDevTool } from "./AuthStateDevTool";

import { AdminDevAuthPanel } from "@/shared/ui/AdminDevAuthPanel/AdminDevAuthPanel";
import { cn } from "@/utils/cn";

interface DevToolDockProps {
  isAuthenticated: boolean;
  isCseStudent: boolean;
  onChange: (nextValue: boolean) => void;
  onCseStudentChange: (nextValue: boolean) => void;
  onPreviewSignupGuide: () => void;
}

type DevToolTab = "auth" | "admin";

export const DevToolDock = ({
  isAuthenticated,
  isCseStudent,
  onChange,
  onCseStudentChange,
  onPreviewSignupGuide,
}: DevToolDockProps) => {
  const { pathname } = useLocation();
  const isAdminRoute = pathname.startsWith("/admin");
  const [isOpen, setIsOpen] = useState(isAdminRoute);
  const [requestedTab, setRequestedTab] = useState<DevToolTab>(
    isAdminRoute ? "admin" : "auth",
  );
  const activeTab = requestedTab;

  if (!isOpen) {
    return (
      <button
        className="fixed right-5 bottom-5 z-50 inline-flex items-center gap-2 rounded-full border border-border-deactivated bg-white/95 px-4 py-3 text-label-05 text-text-primary shadow-[0px_12px_32px_0px_rgba(15,23,42,0.14)] backdrop-blur-sm transition-colors hover:bg-white"
        onClick={() => setIsOpen(true)}
        type="button"
      >
        <Bug className="h-4 w-4" />
        Dev Tool
      </button>
    );
  }

  return (
    <aside className="fixed right-5 bottom-5 z-50 w-[340px] rounded-[28px] border border-border-deactivated bg-white/95 p-4 shadow-[0px_20px_60px_0px_rgba(15,23,42,0.14)] backdrop-blur-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#111827] text-white">
            {activeTab === "admin" ? (
              <ShieldCheck className="h-4 w-4" />
            ) : (
              <Bug className="h-4 w-4" />
            )}
          </div>
          <div>
            <p className="text-caption-01 text-text-placeholder">개발용 도구</p>
            <p className="text-label-04 text-text-primary">
              {activeTab === "admin"
                ? "관리자 테스트 도구"
                : "인증 상태 테스트 도구"}
            </p>
          </div>
        </div>

        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-border-deactivated text-text-secondary transition-colors hover:bg-background-dark hover:text-text-primary"
          onClick={() => setIsOpen(false)}
          type="button"
        >
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <button
          className={cn(
            "rounded-xl px-3 py-2 text-label-06 transition-colors",
            activeTab === "auth"
              ? "bg-primary-600 text-text-inverse"
              : "bg-background-dark text-text-secondary hover:text-text-primary",
          )}
          onClick={() => setRequestedTab("auth")}
          type="button"
        >
          인증 상태
        </button>
        <button
          className={cn(
            "rounded-xl px-3 py-2 text-label-06 transition-colors",
            activeTab === "admin"
              ? "bg-primary-600 text-text-inverse"
              : "bg-background-dark text-text-secondary hover:text-text-primary",
          )}
          onClick={() => setRequestedTab("admin")}
          type="button"
        >
          관리자 로그인
        </button>
      </div>

      <div className="mt-4 rounded-2xl border border-border-deactivated bg-white p-4">
        {activeTab === "admin" ? (
          <AdminDevAuthPanel />
        ) : (
          <AuthStateDevTool
            isAuthenticated={isAuthenticated}
            isCseStudent={isCseStudent}
            onChange={onChange}
            onCseStudentChange={onCseStudentChange}
            onPreviewSignupGuide={onPreviewSignupGuide}
          />
        )}
      </div>
    </aside>
  );
};
