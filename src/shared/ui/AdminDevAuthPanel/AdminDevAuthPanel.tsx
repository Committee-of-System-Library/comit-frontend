import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LogIn, LogOut } from "lucide-react";
import toast from "react-hot-toast";

import { resolveApiUrl } from "@/apis/client";
import { Button } from "@/shared/ui/button/Button";

type DevRole = "ADMIN" | "STUDENT";

interface PresetAccount {
  label: string;
  nickname: string;
  role: DevRole;
}

const presetAccounts: PresetAccount[] = [
  { label: "관리자", nickname: "관리자", role: "ADMIN" },
  { label: "일반유저", nickname: "일반유저", role: "STUDENT" },
  { label: "테스트유저", nickname: "테스트유저", role: "STUDENT" },
];

const isDevAuthVisible = import.meta.env.DEV;

const requestDevAuth = async (nickname: string, role: DevRole) => {
  const response = await fetch(
    resolveApiUrl("/auth/dev/login", { nickname, role }),
    {
      method: "POST",
      credentials: "include",
      headers: { Accept: "application/json" },
    },
  );

  if (!response.ok) {
    const fallbackMessage = `${response.status} ${response.statusText}`;
    let message = fallbackMessage;

    try {
      const payload = (await response.json()) as {
        detail?: string;
        message?: string;
        title?: string;
      };

      message =
        payload.detail ?? payload.message ?? payload.title ?? fallbackMessage;
    } catch {
      message = fallbackMessage;
    }

    throw new Error(message);
  }
};

const requestDevLogout = async () => {
  const response = await fetch(resolveApiUrl("/auth/dev/logout"), {
    method: "POST",
    credentials: "include",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
};

export const AdminDevAuthPanel = () => {
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: ({ nickname, role }: { nickname: string; role: DevRole }) =>
      requestDevAuth(nickname, role),
    onSuccess: async (_, variables) => {
      toast.success(`${variables.nickname} 계정으로 로그인했습니다.`);
      await queryClient.invalidateQueries();
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "임시 관리자 로그인에 실패했습니다.",
      );
    },
  });

  const logoutMutation = useMutation({
    mutationFn: requestDevLogout,
    onSuccess: async () => {
      toast.success("임시 로그인 세션을 종료했습니다.");
      await queryClient.invalidateQueries();
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "로그아웃에 실패했습니다.",
      );
    },
  });

  const isPending = loginMutation.isPending || logoutMutation.isPending;

  if (!isDevAuthVisible) {
    return null;
  }

  const handlePresetClick = (preset: PresetAccount) => {
    loginMutation.mutate({ nickname: preset.nickname, role: preset.role });
  };

  const apiOrigin = (() => {
    try {
      return new URL(resolveApiUrl("/auth/dev/login"), window.location.href)
        .origin;
    } catch {
      return resolveApiUrl("/auth/dev/login");
    }
  })();

  return (
    <section>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-caption-01 text-text-placeholder">
            관리자 테스트 로그인
          </p>
          <p className="mt-1 text-label-05 text-text-primary">
            자주 쓰는 계정만 빠르게 전환합니다.
          </p>
        </div>
        <Button
          className="h-9 rounded-xl px-3"
          disabled={isPending}
          variant="secondary"
          onClick={() => logoutMutation.mutate()}
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>

      <div className="mt-4 grid gap-2">
        {presetAccounts.map((preset) => (
          <button
            key={`${preset.nickname}-${preset.role}`}
            type="button"
            className="flex items-center justify-between rounded-2xl border border-border-deactivated bg-white px-4 py-3 text-left transition-colors hover:border-primary-300 hover:bg-primary-50"
            disabled={isPending}
            onClick={() => handlePresetClick(preset)}
          >
            <div>
              <p className="text-label-04 text-text-primary">{preset.label}</p>
              <p className="mt-1 text-caption-01 text-text-placeholder">
                nickname={preset.nickname}, role={preset.role}
              </p>
            </div>
            <LogIn className="h-4 w-4 text-text-secondary" />
          </button>
        ))}
      </div>

      <details className="mt-4 rounded-2xl border border-border-deactivated bg-background-dark px-4 py-3">
        <summary className="cursor-pointer list-none text-caption-01 text-text-placeholder">
          API 연결 정보 보기
        </summary>
        <p className="mt-2 break-all text-label-05 text-text-primary">
          {apiOrigin}
        </p>
        <p className="mt-3 text-caption-01 leading-5 text-text-placeholder">
          backend의 <code>/auth/dev/*</code> 가 열려 있을 때만 동작합니다.
        </p>
      </details>
    </section>
  );
};
