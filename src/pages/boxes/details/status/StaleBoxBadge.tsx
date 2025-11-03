import { Badge } from "@/components/ui/badge.tsx";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip.tsx";
import { isStatusStale, formatTimeAgo } from "@/utils/time.ts";
import type { components } from "@/api/models/schema";

interface StaleBoxBadgeProps {
  box: components["schemas"]["Box"]
  showOnlyWhenStale?: boolean
}

export function StaleBoxBadge({ box, showOnlyWhenStale = true }: StaleBoxBadgeProps) {
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
          <div className="text-sm space-y-2">
            {statusTime ? (
              <>
                <p>
                  Box status was updated {formatTimeAgo(statusTime)} and looks stale.
                </p>
                <p>
                  Automatic starting of sandboxes for the box is not implemented yet. This will come in a future release of dboxed.
                </p>
                <p>
                  This means you might need to manually run <code className="px-1.5 py-0.5 rounded bg-gray-50/30 font-mono text-xs">dboxed sandbox run ...</code> yourself.
                </p>
                <p>
                  Check the <strong>Connect Box</strong> tab for details.
                </p>
              </>
            ) : (
              <>Status hasn't been updated in over 60 seconds</>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
