import Loading from "@/components/loading"
import { Suspense } from "react"

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section>
      <Suspense fallback={<Loading />}>
        {children}
      </Suspense>
    </section>
  )
}