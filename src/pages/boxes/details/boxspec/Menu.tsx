import { Card, CardContent } from "@/components/ui/card.tsx"

interface MenuProps {
  children: React.ReactNode
  className?: string
}

export function Menu({ children, className = "" }: MenuProps) {
  return (
    <div className={`w-64 ${className}`}>
      <Card className="h-full">
        <CardContent className="pl-4 pr-4">
          <div className="space-y-1">
            {children}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}