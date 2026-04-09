import { cn } from "@/utils/cn";

interface AuthStateDevToolProps {
  isAuthenticated: boolean;
  isCseStudent: boolean;
  onCseStudentChange: (nextValue: boolean) => void;
  onPreviewSignupGuide: () => void;
}

export const AuthStateDevTool = ({
  isAuthenticated,
  isCseStudent,
  onCseStudentChange,
  onPreviewSignupGuide,
}: AuthStateDevToolProps) => (
  <section>
    <p className="text-caption-01 text-text-placeholder">Auth DevTool</p>
    <p className="mt-2 text-label-06 text-text-tertiary">
      현재 인증 상태는 쿠키 기반 <code>/members/me</code> 결과로 반영됩니다.
    </p>
    <div className="mt-2 inline-flex rounded-lg bg-gray-100 px-3 py-1.5 text-label-06 text-text-tertiary">
      상태: {isAuthenticated ? "로그인" : "비로그인"}
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
      className="mt-3 w-full rounded-xl bg-primary-600 px-3 py-2 text-label-06 text-text-inverse transition-colors hover:bg-primary-1000"
      onClick={onPreviewSignupGuide}
      type="button"
    >
      회원가입 모달 보기
    </button>
  </section>
);
