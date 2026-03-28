import { cn } from "@/utils/cn";

interface AuthStateDevToolProps {
  isAuthenticated: boolean;
  isCseStudent: boolean;
  onChange: (nextValue: boolean) => void;
  onCseStudentChange: (nextValue: boolean) => void;
  onPreviewSignupGuide: () => void;
}

export const AuthStateDevTool = ({
  isAuthenticated,
  isCseStudent,
  onChange,
  onCseStudentChange,
  onPreviewSignupGuide,
}: AuthStateDevToolProps) => (
  <aside className="fixed right-4 bottom-4 z-50 rounded-xl border border-gray-200 bg-white/95 p-3 shadow-[0px_8px_24px_0px_rgba(0,0,0,0.12)] backdrop-blur-sm">
    <p className="text-label-06 text-text-tertiary">Auth DevTool</p>
    <div className="mt-2 flex items-center gap-2">
      <button
        className={cn(
          "rounded-lg px-3 py-1.5 text-label-06 transition-colors",
          !isAuthenticated
            ? "bg-primary-600 text-text-inverse"
            : "bg-gray-100 text-text-tertiary hover:bg-gray-200",
        )}
        onClick={() => onChange(false)}
        type="button"
      >
        비로그인
      </button>
      <button
        className={cn(
          "rounded-lg px-3 py-1.5 text-label-06 transition-colors",
          isAuthenticated
            ? "bg-primary-600 text-text-inverse"
            : "bg-gray-100 text-text-tertiary hover:bg-gray-200",
        )}
        onClick={() => onChange(true)}
        type="button"
      >
        로그인
      </button>
    </div>

    <p className="mt-3 text-label-06 text-text-tertiary">회원가입 대상</p>
    <div className="mt-2 flex items-center gap-2">
      <button
        className={cn(
          "rounded-lg px-3 py-1.5 text-label-06 transition-colors",
          isCseStudent
            ? "bg-primary-600 text-text-inverse"
            : "bg-gray-100 text-text-tertiary hover:bg-gray-200",
        )}
        onClick={() => onCseStudentChange(true)}
        type="button"
      >
        컴학
      </button>
      <button
        className={cn(
          "rounded-lg px-3 py-1.5 text-label-06 transition-colors",
          !isCseStudent
            ? "bg-primary-600 text-text-inverse"
            : "bg-gray-100 text-text-tertiary hover:bg-gray-200",
        )}
        onClick={() => onCseStudentChange(false)}
        type="button"
      >
        비컴학
      </button>
    </div>

    <button
      className="mt-3 w-full rounded-lg bg-primary-600 px-3 py-2 text-label-06 text-text-inverse transition-colors hover:bg-primary-1000"
      onClick={onPreviewSignupGuide}
      type="button"
    >
      회원가입 모달 보기
    </button>
  </aside>
);
