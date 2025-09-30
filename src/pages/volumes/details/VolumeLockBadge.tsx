import { Badge } from "@/components/ui/badge.tsx";
import { ReferenceLabel } from "@/components/ReferenceLabel.tsx";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip.tsx";
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx";
import { formatTimeAgo } from "@/utils/time.ts";
import type { components } from "@/api/models/schema";

interface VolumeLockBadgeProps {
  volume: components["schemas"]["Volume"]
}

/**
 * Displays a colored badge indicating the lock status of a volume.
 * - Gray: Not locked
 * - Green: Locked less than 2 minutes ago
 * - Yellow: Locked 2-5 minutes ago
 * - Red: Locked more than 5 minutes ago
 * When locked, shows the box that locked the volume and a tooltip with lock time.
 */
export function VolumeLockBadge({ volume }: VolumeLockBadgeProps) {
  const { workspaceId } = useSelectedWorkspaceId()
  const isLocked = volume.lockId && volume.lockBoxUuid

  if (!isLocked) {
    return (
      <Badge variant="outline">
        Unlocked
      </Badge>
    )
  }

  // Calculate lock age in minutes
  let badgeColor = "bg-green-500 text-white hover:bg-green-600"
  let timePassedText = ""

  if (volume.lockTime) {
    const lockTime = new Date(volume.lockTime)
    const now = new Date()
    const minutesAgo = (now.getTime() - lockTime.getTime()) / 1000 / 60

    if (minutesAgo > 5) {
      badgeColor = "bg-red-500 text-white hover:bg-red-600"
    } else if (minutesAgo > 2) {
      badgeColor = "bg-yellow-500 text-white hover:bg-yellow-600"
    }

    timePassedText = formatTimeAgo(volume.lockTime)
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <Badge variant="secondary" className={badgeColor}>
              Locked
            </Badge>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            {timePassedText && (
              <p>Lock refreshed {timePassedText}</p>
            )}
            <div className="flex items-center gap-1">
              <span>Locked by box:</span>
              <ReferenceLabel<components["schemas"]["Box"]>
                resourceId={volume.lockBoxUuid}
                resourcePath="/v1/workspaces/{workspaceId}/boxes/by-uuid/{uuid}"
                pathParams={{
                  workspaceId: workspaceId,
                  uuid: volume.lockBoxUuid
                }}
                detailsUrl={(box) => `/workspaces/${workspaceId}/boxes/${box.id}`}
                fallbackLabel="Box"
                className="text-blue-400 hover:text-blue-300 underline"
              />
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
