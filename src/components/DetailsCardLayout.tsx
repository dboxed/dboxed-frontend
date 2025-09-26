import { cn } from "@/lib/utils"

interface DetailsCardLayoutProps {
  children: React.ReactNode
  className?: string
}

export function DetailsCardLayout({
  children,
  className
}: DetailsCardLayoutProps) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-4", className)}>
      {children}
    </div>
  )
}