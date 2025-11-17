import type { components } from "@/api/models/schema";
import { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { cn } from "@/lib/utils.ts";
import { decompressDockerPs, type DockerContainer } from "@/pages/boxes/docker-utils.tsx";
import { isStatusStale, formatTimeAgo } from "@/utils/time.ts";

export function ContainerStatusBadge({ box }: { box: components["schemas"]["Box"] }) {
  const [containers, setContainers] = useState<DockerContainer[]>([])
  const statusTime = box.sandboxStatus?.statusTime
  const isStale = !statusTime || isStatusStale(statusTime)

  useEffect(() => {
    if (box.sandboxStatus?.dockerPs) {
      decompressDockerPs(box.sandboxStatus.dockerPs).then(setContainers)
    } else {
      setContainers([])
    }
  }, [box.sandboxStatus?.dockerPs])

  if (!box.sandboxStatus?.dockerPs) {
    return <span className="text-sm text-muted-foreground">N/A</span>
  }

  const runningCount = containers.filter(c => c.State.toLowerCase() === 'running').length
  const totalCount = containers.length
  const allOk = runningCount === totalCount && totalCount > 0

  let containersColorClass = ""
  if (box.sandboxStatus?.runStatus === "running") {
    if (isStale) {
      containersColorClass = 'bg-yellow-400'
    } else if (allOk) {
      containersColorClass = 'bg-green-400'
    } else if (totalCount === 0) {
      containersColorClass = 'bg-red-500'
    } else {
      containersColorClass = 'bg-yellow-400'
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <Badge variant={"secondary"} className={cn("cursor-help", containersColorClass)}>
              {runningCount}/{totalCount}
            </Badge>
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-md">
          <div className="space-y-2">
            {statusTime && (
              <p className="text-xs text-muted-foreground">
                Last updated {formatTimeAgo(statusTime)}
              </p>
            )}
            {isStale && <p className="text-red-500 font-semibold">Box status is stale, containers information is not up-to-date.</p>}
            {containers.length > 0 ? (
              <div className="space-y-1">
                {containers.map((container) => (
                  <div key={container.ID} className="text-xs">
                    <span className="font-semibold">{container.Names}</span>:{' '}
                    <span className={container.State.toLowerCase() === 'running' ? 'text-green-400' : 'text-yellow-400'}>
                      {container.State}
                    </span>
                    {' '}- {container.Status}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs">No containers</p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
