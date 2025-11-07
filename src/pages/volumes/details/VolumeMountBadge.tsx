import { Badge } from "@/components/ui/badge.tsx";
import { ReferenceLabel } from "@/components/ReferenceLabel.tsx";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip.tsx";
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx";
import { formatTimeAgo } from "@/utils/time.ts";
import type { components } from "@/api/models/schema";

interface VolumeMountBadgeProps {
  volume: components["schemas"]["Volume"]
}

export function VolumeMountBadge({ volume }: VolumeMountBadgeProps) {
  const { workspaceId } = useSelectedWorkspaceId()
  const isMounted = !!volume.mountId

  if (!isMounted) {
    return (
      <Badge variant="outline">
        N/A
      </Badge>
    )
  }

  // Calculate mount age in minutes
  let badgeColor = "bg-green-500 text-white hover:bg-green-600"
  let timePassedText = ""

  if (volume.mountStatus) {
    const statusTime = new Date(volume.mountStatus.statusTime)
    const now = new Date()
    const minutesAgo = (now.getTime() - statusTime.getTime()) / 1000 / 60

    if (minutesAgo > 5) {
      badgeColor = "bg-red-500 text-white hover:bg-red-600"
    } else if (minutesAgo > 2) {
      badgeColor = "bg-yellow-500 text-white hover:bg-yellow-600"
    }

    timePassedText = formatTimeAgo(volume.mountStatus.statusTime)
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="secondary" className={badgeColor}>
            Mounted
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            {timePassedText && (
              <p>Mount status refreshed {timePassedText}</p>
            )}
            {volume.mountStatus?.boxId && <div className="flex items-center gap-1">
              <span>Mounted by box:</span>
              <ReferenceLabel<components["schemas"]["Box"]>
                resourceId={volume.mountStatus.boxId}
                resourcePath="/v1/workspaces/{workspaceId}/boxes/{id}"
                pathParams={{
                  workspaceId: workspaceId,
                  id: volume.mountStatus.boxId
                }}
                detailsUrl={(box) => `/workspaces/${workspaceId}/boxes/${box.id}`}
                fallbackLabel="Box"
                className="text-blue-400 hover:text-blue-300 underline"
              />
            </div>}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
