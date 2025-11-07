import { Badge } from "@/components/ui/badge.tsx"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip.tsx"
import { Link } from "react-router"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { TimeAgo } from "@/components/TimeAgo.tsx"
import { Loader2, CheckCircle, XCircle } from "lucide-react"
import type { components } from "@/api/models/schema"

interface SnapshotStatusCellProps {
  mountStatus?: components["schemas"]["VolumeMountStatus"]
  volumeId: string
}

export function SnapshotStatusCell({ mountStatus, volumeId }: SnapshotStatusCellProps) {
  const { workspaceId } = useSelectedWorkspaceId()

  if (!mountStatus) {
    return <span className="text-sm text-muted-foreground">N/A</span>
  }

  const { snapshotStartTime, snapshotEndTime, lastFinishedSnapshotId } = mountStatus

  // No snapshot activity
  if (!snapshotStartTime) {
    return <span className="text-sm text-muted-foreground">No snapshot activity</span>
  }

  // Snapshot in progress
  if (snapshotStartTime && !snapshotEndTime) {
    return (
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
        <Badge variant="secondary" className="flex items-center gap-1">
          Creating
        </Badge>
        <span className="text-xs text-muted-foreground">
          started <TimeAgo date={snapshotStartTime} />
        </span>
      </div>
    )
  }

  // Snapshot completed (snapshotStartTime && snapshotEndTime)
  if (snapshotStartTime && snapshotEndTime) {
    // Check if there's an error (we'll use the presence of lastFinishedSnapshotId to determine success)
    // If no lastFinishedSnapshotId but we have end time, assume it failed
    const hasFailed = !lastFinishedSnapshotId

    if (hasFailed) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 cursor-help">
                <XCircle className="h-4 w-4 text-destructive" />
                <Badge variant="destructive">
                  Snapshot failed
                </Badge>
                <span className="text-xs text-muted-foreground">
                  <TimeAgo date={snapshotEndTime} />
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm">
                Snapshot creation failed. No snapshot ID was recorded.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    }

    // Snapshot succeeded
    return (
      <div className="flex items-center gap-2">
        <CheckCircle className="h-4 w-4 text-green-500" />
        <Link
          to={`/workspaces/${workspaceId}/volumes/${volumeId}/snapshots/${lastFinishedSnapshotId}`}
          className="text-blue-600 hover:text-blue-800 underline text-sm"
        >
          Completed
        </Link>
        <span className="text-xs text-muted-foreground">
          <TimeAgo date={snapshotEndTime} />
        </span>
      </div>
    )
  }

  return <span className="text-sm text-muted-foreground">Unknown status</span>
}
