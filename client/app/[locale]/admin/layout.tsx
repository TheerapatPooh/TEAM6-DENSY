import Header from "@/components/header";

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