import type { ReactNode } from "react";

import {
  FileText,
  Flag,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  ShieldCheck,
  Users,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

import { AdminDevAuthPanel } from "@/shared/ui/AdminDevAuthPanel/AdminDevAuthPanel";
import { LogoutButton } from "@/shared/ui/LogoutButton/LogoutButton";
import { cn } from "@/utils/cn";

interface AdminShellProps {
  children: ReactNode;
}

const navItems = [
  { icon: LayoutDashboard, label: "대시보드", to: "/admin" },
  { icon: Users, label: "회원 관리", to: "/admin/members" },
  { icon: Flag, label: "신고 관리", to: "/admin/reports" },
  { icon: FileText, label: "게시글 관리", to: "/admin/posts" },
  { icon: MessageSquare, label: "댓글 관리", to: "/admin/comments" },
];

export const AdminShell = ({ children }: AdminShellProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#f4f6fb] text-text-primary">
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px] gap-6 px-4 py-4 min-[1200px]:px-6">
        <aside className="flex w-full max-w-none shrink-0 flex-col rounded-[32px] border border-border-deactivated bg-white p-5 shadow-sm min-[1080px]:w-44">
          <div className="rounded-3xl bg-primary-1000 px-4 py-5 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-label-05 text-white/70">관리자 화면</p>
                <p className="mt-1 text-subtitle-03">Comit Admin</p>
              </div>
            </div>
          </div>

          <nav className="mt-6 flex flex-1 flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-2xl px-3 py-3 text-label-04 text-text-secondary transition-colors hover:bg-background-dark hover:text-text-primary",
                      isActive && "bg-background-dark text-text-primary",
                    )
                  }
                  end={item.to === "/admin"}
                  to={item.to}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <AdminDevAuthPanel />

          <div className="mt-6 border-t border-border-deactivated pt-4">
            <LogoutButton
              className="h-12 w-full rounded-2xl px-3"
              onClick={handleLogout}
            />
            <div className="mt-2 flex items-center gap-2 px-2 text-caption-01 text-text-placeholder">
              <LogOut className="h-4 w-4" />
              운영 세션 종료
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1 rounded-[32px] border border-border-deactivated bg-white p-6 shadow-sm min-[1080px]:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
