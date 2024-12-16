import Header from "@/components/header";
import { AdminSidebar } from "@/components/admin-sidebar";

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
          <Header variant="admin"/>
          {children}
        </div>
      </div>
    </>
    ); 
  }