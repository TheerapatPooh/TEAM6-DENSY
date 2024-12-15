import Header from "@/components/header";

export default function PatrolLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header variant="supervisor" />
      <div className="px-6 py-4">
        {children}
      </div>
    </>
  );
}