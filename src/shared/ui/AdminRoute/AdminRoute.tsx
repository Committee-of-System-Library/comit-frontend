import type { ReactNode } from "react";

import { Navigate } from "react-router-dom";

import { useMyProfileQuery } from "@/features/member/model/useMyProfileQuery";

export const AdminRoute = ({ children }: { children: ReactNode }) => {
  const { data: myProfile, isLoading } = useMyProfileQuery();

  if (isLoading) {
    return null;
  }

  if (myProfile?.role !== "ADMIN") {
    return <Navigate replace to="/" />;
  }

  return <>{children}</>;
};
