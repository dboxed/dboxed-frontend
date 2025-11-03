import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.tsx"
import { AlertTriangle } from "lucide-react"
import type { components } from "@/api/models/schema"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { useDboxedQueryClient } from "@/api/api.ts"
import { formatTimeAgo, isStatusStale } from "@/utils/time.ts"

interface BoxStatusStalenessAlertProps {
  box: components["schemas"]["Box"]
}

export function BoxStatusStalenessAlert({ box }: BoxStatusStalenessAlertProps) {
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useDboxedQueryClient()
  const [tick, setTick] = useState<number>(0)

  const { data: sandboxStatus } = client.useQuery('get', "/v1/workspaces/{workspaceId}/boxes/{id}/sandbox-status", {
    params: {
      path: {
        workspaceId: workspaceId!,
        id: box.id,
      }
    },
  }, {
    refetchInterval: 5000, // Refresh every 5 seconds
  })

  // Re-render every second to update staleness check
  useEffect(() => {
    if (!sandboxStatus?.statusTime) {
      return
    }

    // Update every second to keep staleness check current
    const interval = setInterval(() => {
      setTick(t => t + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [sandboxStatus?.statusTime])

  const isStale = isStatusStale(sandboxStatus?.statusTime)

  // Only show if status is stale and box should be up
  if (!isStale || !sandboxStatus?.statusTime || box.desiredState !== 'up') {
    return null
  }

  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Stale Status</AlertTitle>
      <AlertDescription>
        Box status was updated {formatTimeAgo(sandboxStatus.statusTime)} and looks stale.<br/>
        <p>
          Automatic starting of sandboxes for the box is not implemented yet. This will come in a future release of dboxed.
        </p>
        <p>
          This means you might need to manually run <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-xs">dboxed sandbox run ...</code> yourself.
        </p>
        <p>
          Check the <strong>Connect Box</strong> tab for details.
        </p>
      </AlertDescription>
    </Alert>
  )
}
