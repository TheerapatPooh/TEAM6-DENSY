import Header from "@/components/header";
import { AdminSidebar } from "@/components/admin-sidebar";

export default function AdminLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
    <>
      <div className="flex flex-row bg-red-400 overflow-x-hidden overflow-y-hidden">
        <AdminSidebar />
        <div className="flex flex-col overflow-y-hidden overflow-x-hidden">
          <Header withLogo={false}/>
          {children}
        </div>
      </div>
    </>
    ); 
  }