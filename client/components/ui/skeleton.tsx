import { cn } from "@/lib/utils"

// eslint-disable-next-line @typescript-eslint/naming-convention
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-secondary/70", className)}
      {...props}
    />
  )
}

export { Skeleton }
