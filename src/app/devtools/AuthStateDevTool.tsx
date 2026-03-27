import { cn } from "@/utils/cn";

interface AuthStateDevToolProps {
  isAuthenticated: boolean;
  onChange: (nextValue: boolean) => void;
}

export const AuthStateDevTool = ({
  isAuthenticated,
  onChange,
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
  </aside>
);
