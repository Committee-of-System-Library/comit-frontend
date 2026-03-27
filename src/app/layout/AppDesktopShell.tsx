import type { ReactNode } from "react";

import { CommonDesktopLayout } from "@/widgets/layout/CommonDesktopLayout";
import { DefaultRightRail } from "@/widgets/layout/DefaultRightRail";

interface AppDesktopShellProps {
  children: ReactNode;
  isAuthenticated: boolean;
  mainClassName?: string;
  rightRail?: ReactNode | null;
  rightRailClassName?: string;
  topBanner?: ReactNode;
}

export const AppDesktopShell = ({
  children,
  isAuthenticated,
  mainClassName,
  rightRail,
  rightRailClassName,
  topBanner,
}: AppDesktopShellProps) => (
  <CommonDesktopLayout
    headerProps={{ isAuthenticated }}
    mainClassName={mainClassName}
    rightRail={rightRail === undefined ? <DefaultRightRail /> : rightRail}
    rightRailClassName={rightRailClassName}
    topBanner={topBanner}
  >
    {children}
  </CommonDesktopLayout>
);
