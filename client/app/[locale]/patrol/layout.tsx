'use client'
import Header from "@/components/header";

export default function PatrolLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
        <Header variant="inspector" />
        {children}

    </>
  );
}