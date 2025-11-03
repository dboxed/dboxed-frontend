import { Badge } from "@/components/ui/badge.tsx";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip.tsx";
import { isStatusStale, formatTimeAgo } from "@/utils/time.ts";
import type { components } from "@/api/models/schema";

interface StaleBoxBadgeProps {
  box: components["schemas"]["Box"]
  showOnlyWhenStale?: boolean
  size?: "default" | "sm" | "lg"
}

export function StaleBoxBadge({ box, showOnlyWhenStale = true, size = "default" }: StaleBoxBadgeProps) {
  const statusTime = box.sandboxStatus?.statusTime
  const isStale = isStatusStale(statusTime)

  // Don't render if box desired state is not 'up'
  if (box.desiredState !== 'up') {
    return null
  }

  // Don't render if not stale and showOnlyWhenStale is true
  if (showOnlyWhenStale && !isStale) {
    return null
  }

  const badge = (
    <Badge
      variant="destructive"
    >
      Stale
    </Badge>
  )

  // Wrap in tooltip with explanation and time ago
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="w-fit">
            {badge}
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-md">
          <div className="text-sm">
            {statusTime ? (
              <>Last updated {formatTimeAgo(statusTime)}</>
            ) : (
              <>Status hasn't been updated in over 60 seconds</>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
