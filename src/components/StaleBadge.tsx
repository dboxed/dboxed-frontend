import { Badge } from "@/components/ui/badge.tsx";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip.tsx";
import { isStatusStale, formatTimeAgo } from "@/utils/time.ts";

interface StaleBadgeProps {
  statusTime: Date | string | null | undefined
  showOnlyWhenStale?: boolean
  size?: "default" | "sm" | "lg"
}

export function StaleBadge({ statusTime, showOnlyWhenStale = true, size = "default" }: StaleBadgeProps) {
  const isStale = isStatusStale(statusTime)

  // Don't render if not stale and showOnlyWhenStale is true
  if (showOnlyWhenStale && !isStale) {
    return null
  }

  const badge = (
    <Badge
      variant="outline"
      className={`cursor-help text-amber-600 border-amber-600 ${
        size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : ''
      }`}
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
