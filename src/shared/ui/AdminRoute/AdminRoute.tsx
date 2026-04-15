import type { ReactNode } from "react";

import { Navigate } from "react-router-dom";

import { useMyProfileQuery } from "@/features/member/model/useMyProfileQuery";

export const AdminRoute = ({ children }: { children: ReactNode }) => {
  const { data: myProfile } = useMyProfileQuery();

  if (myProfile?.role !== "ADMIN") {
    return <Navigate replace to="/" />;
  }

  return <>{children}</>;
};
