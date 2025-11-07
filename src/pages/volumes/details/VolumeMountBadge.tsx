import { Badge } from "@/components/ui/badge.tsx";
import { ReferenceLabel } from "@/components/ReferenceLabel.tsx";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip.tsx";
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx";
import { formatTimeAgo } from "@/utils/time.ts";
import type { components } from "@/api/models/schema";
import { useEffect, useState } from "react";

interface VolumeMountBadgeProps {
  mountStatus?: components["schemas"]["VolumeMountStatus"]
}

export function VolumeMountBadge({ mountStatus }: VolumeMountBadgeProps) {
  const { workspaceId } = useSelectedWorkspaceId()
  const [ ticker, setTicker ] = useState(0)

  useEffect(() => {
    const t = setInterval(() => {
      setTicker(x => x + 1)
    }, 1000)
    return () => clearTimeout(t)
  }, []);
  useEffect(() => {
    // just a dummy to force re-render
  }, [ticker]);

  // No mount status - volume was never mounted
  if (!mountStatus) {
    return (
      <Badge variant="outline">
        Never Mounted
      </Badge>
    )
  }

  // Volume was released
  if (mountStatus.releaseTime) {
    const badgeVariant = mountStatus.forceReleased ? "destructive" : "outline"
    const badgeText = mountStatus.forceReleased ? "Force Released" : "Released"

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant={badgeVariant}>
              {badgeText}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <div className="space-y-1">
              <p>Released {formatTimeAgo(mountStatus.releaseTime)}</p>
              {mountStatus.forceReleased && (
                <p className="text-red-400 font-semibold">This mount was force released</p>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  // Volume is currently mounted
  // Calculate mount age in minutes
  let badgeColor = "bg-green-500 text-white hover:bg-green-600"
  let timePassedText = ""

  const statusTime = new Date(mountStatus.statusTime)
  const now = new Date()
  const minutesAgo = (now.getTime() - statusTime.getTime()) / 1000 / 60

  if (minutesAgo > 5) {
    badgeColor = "bg-red-500 text-white hover:bg-red-600"
  } else if (minutesAgo > 2) {
    badgeColor = "bg-yellow-500 text-white hover:bg-yellow-600"
  }

  timePassedText = formatTimeAgo(mountStatus.statusTime)

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
            {mountStatus?.boxId && <div className="flex items-center gap-1">
              <span>Mounted by box:</span>
              <ReferenceLabel<components["schemas"]["Box"]>
                resourceId={mountStatus.boxId}
                resourcePath="/v1/workspaces/{workspaceId}/boxes/{id}"
                pathParams={{
                  workspaceId: workspaceId,
                  id: mountStatus.boxId
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
