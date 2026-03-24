import type { ReactNode } from "react";

import { CommonDesktopLayout } from "@/widgets/layout/CommonDesktopLayout";
import { DefaultRightRail } from "@/widgets/layout/DefaultRightRail";

interface AppDesktopShellProps {
  children: ReactNode;
  isAuthenticated?: boolean;
  rightRail?: ReactNode;
}

export const AppDesktopShell = ({
  children,
  isAuthenticated = true,
  rightRail,
}: AppDesktopShellProps) => (
  <CommonDesktopLayout
    headerProps={{ isAuthenticated }}
    rightRail={rightRail ?? <DefaultRightRail />}
  >
    {children}
  </CommonDesktopLayout>
);
