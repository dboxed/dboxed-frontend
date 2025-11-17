import { Badge } from "@/components/ui/badge.tsx";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip.tsx";
import type { ReactElement } from "react";

interface StatusComponentProps {
  item: {
    status: string
    statusDetails?: string
  }
  size?: "default" | "sm" | "lg"
  variant?: "default" | "destructive" | "outline" | "secondary" | "warning" | "success"
  tooltip?: ReactElement
}

function getStatusVariant(status: string): "default" | "destructive" | "outline" | "secondary" | "warning" | "success" {
  switch (status.toLowerCase()) {
    case 'ok':
    case 'active':
    case 'running':
    case 'ready':
    case 'new':
      return 'success'
    case 'pending':
    case 'starting':
      return 'secondary'
    case 'degraded':
    case 'stale':
      return 'warning'
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

export function StatusBadge({ item, size = "default", variant: overrideVariant, tooltip }: StatusComponentProps) {
  const variant = overrideVariant ?? getStatusVariant(item.status)

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
            {tooltip || item.statusDetails}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
