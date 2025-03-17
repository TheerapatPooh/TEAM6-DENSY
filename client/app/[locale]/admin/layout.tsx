/**
 * คำอธิบาย:
 * คอมโพเนนต์ AdminLayout ใช้ในการจัดโครงสร้างเลย์เอาต์ของหน้าผู้ดูแลระบบ (Admin)
 * ซึ่งประกอบด้วย Sidebar, Header, และ TabMenu และแสดงเนื้อหาของลูก (children) ที่ผ่านเข้ามา
 * นอกจากนี้ยังรองรับการโหลดหน้าในขณะที่ข้อมูลยังไม่ถูกโหลด
 *
 * Input:
 * - children: เนื้อหาที่จะถูกแสดงในส่วนหลักของหน้า
 *
 * Output:
 * - แสดง Sidebar และ Header พร้อมเนื้อหาหลักจาก children
 * - หากยังไม่โหลดเสร็จจะมีการแสดง Loading
**/
"use client";
import Header from "@/components/header";
import { AdminSidebar } from "@/components/admin-sidebar";
import TabMenu from "@/components/tab-menu";
import { useEffect, useState } from "react";
import Loading from "@/components/loading";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Loading />;
  }

  return (
    <section className="flex flex-row h-screen">
      <AdminSidebar />
      <div className="flex-grow overflow-x-hidden overflow-y-auto">
        <Header variant="admin" />
        <div className="flex flex-col gap-4 py-4 px-6">
          <TabMenu />
          {children}
        </div>
      </div>
    </section>
  );
}
