import Header from "@/components/header";

export default function PatrolLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
    <>
      <Header variant={"profile"} />
      {children}
    </>
    );
  }