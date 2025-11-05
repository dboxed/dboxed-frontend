import { Badge } from "@/components/ui/badge.tsx";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip.tsx";
import { isStatusStale, formatTimeAgo } from "@/utils/time.ts";
import { StatusBadge } from "@/components/StatusBadge.tsx";
import type { components } from "@/api/models/schema";

interface SandboxStatusBadgeProps {
  sandboxStatus?: components["schemas"]["BoxSandboxStatus"]
}

export function SandboxStatusBadge({ sandboxStatus }: SandboxStatusBadgeProps) {
  const statusTime = sandboxStatus?.statusTime
  const isStale = !statusTime || isStatusStale(statusTime)
  const runStatus = sandboxStatus?.runStatus

  const badge = isStale ? (
    <Badge variant="destructive">
      Stale
    </Badge>
  ) : (
    <StatusBadge
      item={{
        status: runStatus || "N/A",
      }}
    />
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
            {isStale ? (
              <>
                {statusTime ? (
                  <p>
                    Box status was updated {formatTimeAgo(statusTime)} and looks stale.
                  </p>
                ) : (
                  <p>
                    Status has never been sent.
                  </p>
                )}
                <p>
                  Automatic starting of sandboxes for the box is not implemented yet. This will come in a future release
                  of dboxed.
                </p>
                <p>
                  This means you might need to manually run <code
                  className="px-1.5 py-0.5 rounded bg-gray-50/30 font-mono text-xs">dboxed sandbox run
                  ...</code> yourself.
                </p>
                <p>
                  Check the <strong>Connect Box</strong> tab for details.
                </p>
              </>
            ) : (
              <>
                {statusTime && (
                  <p>
                    Last updated {formatTimeAgo(statusTime)}
                  </p>
                )}
              </>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
