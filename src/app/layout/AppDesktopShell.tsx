import type { ReactNode } from "react";

import { CommonDesktopLayout } from "@/widgets/layout/CommonDesktopLayout";
import { DefaultRightRail } from "@/widgets/layout/DefaultRightRail";

interface AppDesktopShellProps {
  children: ReactNode;
  isAuthenticated?: boolean;
  mainClassName?: string;
  rightRail?: ReactNode | null;
}

export const AppDesktopShell = ({
  children,
  isAuthenticated = true,
  mainClassName,
  rightRail,
}: AppDesktopShellProps) => (
  <CommonDesktopLayout
    headerProps={{ isAuthenticated }}
    mainClassName={mainClassName}
    rightRail={rightRail === undefined ? <DefaultRightRail /> : rightRail}
  >
    {children}
  </CommonDesktopLayout>
);
