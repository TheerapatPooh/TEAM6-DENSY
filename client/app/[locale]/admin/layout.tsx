'use client'
import Header from "@/components/header";
import { AdminSidebar } from "@/components/admin-sidebar";
import TabMenu from "@/components/tab-menu";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="flex flex-row h-screen">
        <AdminSidebar />
        <div className="flex-grow overflow-x-hidden overflow-y-auto">
          <Header variant="admin" />
          <div className="flex flex-col gap-4 py-4 px-6">
            <TabMenu />
            {children}
          </div>
        </div>
      </div>
    </>
  );
}