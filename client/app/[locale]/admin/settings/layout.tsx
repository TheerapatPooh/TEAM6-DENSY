'use client'
import TabMenu from "@/components/tab-menu"

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col px-6 py-4 gap-4">
      <TabMenu></TabMenu>
      {children}
    </section>
  )
}