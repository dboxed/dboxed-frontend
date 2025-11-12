import { Badge } from "@/components/ui/badge.tsx"

interface IngressProxyStatusBadgeProps {
  status: string
}

export function IngressProxyStatusBadge({ status }: IngressProxyStatusBadgeProps) {
  const statusLower = status.toLowerCase()

  let variant: "default" | "secondary" | "destructive" | "outline" = "secondary"
  let colorClass = ""

  switch (statusLower) {
    case "running":
    case "active":
    case "ready":
      variant = "default"
      colorClass = "bg-green-500 hover:bg-green-600"
      break
    case "starting":
    case "pending":
      variant = "secondary"
      colorClass = "bg-yellow-500 hover:bg-yellow-600"
      break
    case "stopped":
    case "inactive":
      variant = "secondary"
      colorClass = "bg-gray-500 hover:bg-gray-600"
      break
    case "error":
    case "failed":
      variant = "destructive"
      break
    default:
      variant = "outline"
  }

  return (
    <Badge variant={variant} className={colorClass}>
      {status}
    </Badge>
  )
}
