import Header from "@/components/header";
import { AdminSidebar } from "@/components/admin-sidebar";

export default function AdminLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
    <>
      <Header variant="admin"/>
      {children}
    </>
    ); 
  }