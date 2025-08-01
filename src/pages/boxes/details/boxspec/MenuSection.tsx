import { Separator } from "@/components/ui/separator.tsx"

interface MenuSectionProps {
  children: React.ReactNode
  showSeparator?: boolean
}

export function MenuSection({ children, showSeparator = false }: MenuSectionProps) {
  return (
    <>
      {showSeparator && (
        <div className="py-2">
          <Separator />
        </div>
      )}
      <div className="space-y-1">
        {children}
      </div>
    </>
  )
}