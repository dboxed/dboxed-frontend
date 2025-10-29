import { Badge } from "@/components/ui/badge.tsx";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip.tsx";

interface StatusComponentProps {
  item: {
    status: string
    statusDetails?: string
  }
  size?: "default" | "sm" | "lg"
}

function getStatusVariant(status: string): "default" | "destructive" | "outline" | "secondary" | "success" {
  switch (status.toLowerCase()) {
    case 'ok':
    case 'active':
    case 'running':
      return 'success'
    case 'pending':
    case 'starting':
      return 'secondary'
    case 'error':
    case 'failed':
    case 'exited':
      return 'destructive'
    case 'stopped':
    case 'paused':
      return 'outline'
    default:
      return 'default'
  }
}

export function StatusBadge({ item, size = "default" }: StatusComponentProps) {
  const variant = getStatusVariant(item.status)

  const badge = (
    <Badge
      variant={variant}
      className={`capitalize ${item.statusDetails ? 'cursor-help' : ''} ${
        size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : ''
      }`}
    >
      {item.status}
    </Badge>
  )

  // If no statusDetails, just show the badge
  if (!item.statusDetails || item.statusDetails.trim() === '') {
    return badge
  }

  // If statusDetails exists, wrap in tooltip
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="w-fit">
            {badge}
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-md">
          <div className="text-sm whitespace-pre-wrap">
            {item.statusDetails}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
