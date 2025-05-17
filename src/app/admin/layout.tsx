"use client";

import { useRouteGuard } from "../_hooks/useRouteGuard";
import Sidebar from "./_components/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useRouteGuard();

  return (
    <>
      {/* サイドバー */}
      <Sidebar />
      {/* メインエリア */}
      <div className="ml-[280px] p-4">{children}</div>
    </>
  );
}
