import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

interface LabelAndValueProps {
  label: string
  value?: React.ReactNode
  textValue?: string | number
  className?: string
  valueClassName?: string
}

export function LabelAndValue({ label, value, textValue, className, valueClassName }: LabelAndValueProps) {
  const displayValue = value ?? (
    <span className="font-mono break-all">{textValue}</span>
  )

  return (
    <div className={cn("space-y-1", className)}>
      <Label>{label}</Label>
      <div className={cn("text-sm text-muted-foreground", valueClassName)}>
        {displayValue}
      </div>
    </div>
  )
}