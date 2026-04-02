import { useMemo, useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bug, LogIn, LogOut } from "lucide-react";
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

const isDevAuthVisible =
  import.meta.env.DEV || import.meta.env.VITE_ENABLE_DEV_AUTH === "true";

const requestDevAuth = async (nickname: string, role: DevRole) => {
  const response = await fetch(
    resolveApiUrl("/auth/dev/login", { nickname, role }),
    {
      method: "POST",
      credentials: "include",
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

      message = payload.detail ?? payload.message ?? payload.title ?? fallbackMessage;
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
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
};

export const AdminDevAuthPanel = () => {
  const queryClient = useQueryClient();
  const [selectedNickname, setSelectedNickname] = useState("관리자");
  const [selectedRole, setSelectedRole] = useState<DevRole>("ADMIN");

  const selectedPreset = useMemo(
    () =>
      presetAccounts.find(
        (preset) =>
          preset.nickname === selectedNickname && preset.role === selectedRole,
      ),
    [selectedNickname, selectedRole],
  );

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
    setSelectedNickname(preset.nickname);
    setSelectedRole(preset.role);
    loginMutation.mutate({ nickname: preset.nickname, role: preset.role });
  };

  const handleManualLogin = () => {
    loginMutation.mutate({ nickname: selectedNickname, role: selectedRole });
  };

  const apiOrigin = (() => {
    try {
      return new URL(resolveApiUrl("/auth/dev/login"), window.location.href).origin;
    } catch {
      return resolveApiUrl("/auth/dev/login");
    }
  })();

  return (
    <section className="mt-6 rounded-[24px] border border-border-deactivated bg-[#f8f9fc] p-4">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#111827] text-white">
          <Bug className="h-4 w-4" />
        </div>
        <div>
          <p className="text-caption-01 text-text-placeholder">임시 Dev Auth</p>
          <p className="text-label-04 text-text-primary">
            관리자 API 테스트 로그인
          </p>
        </div>
      </div>

      <p className="mt-3 text-caption-01 leading-5 text-text-secondary">
        현재 API origin은 <span className="font-semibold text-text-primary">{apiOrigin}</span>
        입니다. backend의 <code>/auth/dev/*</code> 엔드포인트가 열려 있을 때만 동작합니다.
      </p>

      <div className="mt-4 grid gap-2">
        {presetAccounts.map((preset) => (
          <button
            key={`${preset.nickname}-${preset.role}`}
            type="button"
            className="flex items-center justify-between rounded-2xl border border-border-deactivated bg-white px-3 py-3 text-left transition-colors hover:border-primary-300 hover:bg-primary-50"
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

      <div className="mt-4 rounded-2xl border border-border-deactivated bg-white p-3">
        <p className="text-caption-01 text-text-placeholder">직접 선택</p>
        <div className="mt-2 grid gap-2">
          <label className="grid gap-1">
            <span className="text-caption-01 text-text-secondary">nickname</span>
            <select
              className="h-10 rounded-xl border border-border-deactivated px-3 text-label-04 text-text-primary outline-none focus:border-primary-400"
              value={selectedNickname}
              onChange={(event) => setSelectedNickname(event.target.value)}
            >
              {presetAccounts.map((preset) => (
                <option key={preset.nickname} value={preset.nickname}>
                  {preset.nickname}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-1">
            <span className="text-caption-01 text-text-secondary">role</span>
            <select
              className="h-10 rounded-xl border border-border-deactivated px-3 text-label-04 text-text-primary outline-none focus:border-primary-400"
              value={selectedRole}
              onChange={(event) => setSelectedRole(event.target.value as DevRole)}
            >
              <option value="ADMIN">ADMIN</option>
              <option value="STUDENT">STUDENT</option>
            </select>
          </label>
        </div>

        <div className="mt-3 flex gap-2">
          <Button
            className="h-10 flex-1 rounded-xl"
            disabled={isPending}
            onClick={handleManualLogin}
          >
            {selectedPreset ? `${selectedPreset.label} 로그인` : "선택한 계정 로그인"}
          </Button>
          <Button
            className="h-10 rounded-xl px-3"
            disabled={isPending}
            variant="secondary"
            onClick={() => logoutMutation.mutate()}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};
