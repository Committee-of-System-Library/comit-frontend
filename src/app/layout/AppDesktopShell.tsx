import type { ReactNode } from "react";

import { CommonDesktopLayout } from "@/widgets/layout/CommonDesktopLayout";
import { DefaultRightRail } from "@/widgets/layout/DefaultRightRail";

interface AppDesktopShellProps {
  children: ReactNode;
  isAuthenticated?: boolean;
  mainClassName?: string;
  rightRail?: ReactNode | null;
  topBanner?: ReactNode;
}

export const AppDesktopShell = ({
  children,
  isAuthenticated = true,
  mainClassName,
  rightRail,
  topBanner,
}: AppDesktopShellProps) => (
  <CommonDesktopLayout
    headerProps={{ isAuthenticated }}
    mainClassName={mainClassName}
    rightRail={rightRail === undefined ? <DefaultRightRail /> : rightRail}
    topBanner={topBanner}
  >
    {children}
  </CommonDesktopLayout>
);
