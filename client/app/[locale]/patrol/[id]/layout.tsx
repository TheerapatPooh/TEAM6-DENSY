"use client";

import { PatrolProvider } from "@/context/patrol-context";

export default function PatrolLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PatrolProvider>
      <div className="flex flex-col gap-4 px-6 py-4">{children}</div>
    </PatrolProvider>
  );
}
