import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.tsx"
import { AlertTriangle } from "lucide-react"
import type { components } from "@/api/models/schema"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { useDboxedQueryClient } from "@/api/api.ts"

interface BoxStatusStalenessAlertProps {
  box: components["schemas"]["Box"]
}

export function BoxStatusStalenessAlert({ box }: BoxStatusStalenessAlertProps) {
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useDboxedQueryClient()
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0)

  const { data: runStatus } = client.useQuery('get', "/v1/workspaces/{workspaceId}/boxes/{id}/run-status", {
    params: {
      path: {
        workspaceId: workspaceId!,
        id: box.id,
      }
    },
  }, {
    refetchInterval: 5000, // Refresh every 5 seconds
  })

  // Track staleness of status
  useEffect(() => {
    if (!runStatus?.statusTime) {
      setElapsedSeconds(0)
      return
    }

    const calculateElapsed = () => {
      const statusTime = new Date(runStatus.statusTime!).getTime()
      const now = Date.now()
      const elapsed = Math.floor((now - statusTime) / 1000)
      setElapsedSeconds(elapsed)
    }

    // Calculate immediately
    calculateElapsed()

    // Update every second
    const interval = setInterval(calculateElapsed, 1000)

    return () => clearInterval(interval)
  }, [runStatus?.statusTime])

  const isStale = elapsedSeconds >= 60

  // Only show if status is stale and box should be up
  if (!isStale || !runStatus?.statusTime || box.desiredState !== 'up') {
    return null
  }

  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Stale Status</AlertTitle>
      <AlertDescription>
        Box status has not updated for {elapsedSeconds} seconds.<br/>
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
