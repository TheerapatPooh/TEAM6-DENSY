import Header from "@/components/header";

export default function SupervisorLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
    <>
      <Header />
      {children}
    </>
    );
  }