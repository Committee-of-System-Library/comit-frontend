import { Navigate, Route, Routes } from "react-router-dom";

import { AdminShell } from "@/app/layout/AdminShell";
import AdminCommentPage from "@/pages/admin/AdminCommentPage";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import AdminMemberPage from "@/pages/admin/AdminMemberPage";
import AdminPostPage from "@/pages/admin/AdminPostPage";
import AdminReportPage from "@/pages/admin/AdminReportPage";

const AdminApp = () => (
  <AdminShell>
    <Routes>
      <Route element={<AdminDashboardPage />} index />
      <Route element={<AdminMemberPage />} path="members" />
      <Route element={<AdminReportPage />} path="reports" />
      <Route element={<AdminPostPage />} path="posts" />
      <Route element={<AdminCommentPage />} path="comments" />
      <Route element={<Navigate replace to="/admin" />} path="*" />
    </Routes>
  </AdminShell>
);

export default AdminApp;
