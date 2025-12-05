import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { useDboxedQueryClient } from "@/api/client.ts"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog.tsx"
import { LogViewerWithControls } from "../../../logs/LogViewerWithControls.tsx"

interface ReconcileLogsDialogProps {
  boxId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ReconcileLogsDialog({ boxId, open, onOpenChange }: ReconcileLogsDialogProps) {
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useDboxedQueryClient()

  // Fetch available log files
  const logFiles = client.useQuery('get', "/v1/workspaces/{workspaceId}/logs", {
    params: {
      path: {
        workspaceId: workspaceId!,
      },
      query: {
        owner_type: 'box',
        owner_id: boxId,
      }
    },
  }, {
    enabled: open && !!workspaceId,
    refetchInterval: 10000,
  })

  // Filter for reconcile.log
  const reconcileLogFiles = logFiles.data?.items?.filter(logFile =>
    logFile.fileName === 'dboxed/run-in-sandbox.log'
  ) || []

  if (!workspaceId) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-[80%] max-h-[80%]">
        <DialogHeader>
          <DialogTitle>Reconcile Logs</DialogTitle>
        </DialogHeader>

        {reconcileLogFiles.length === 0 ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            No reconcile log file found
          </div>
        ) : (
          <LogViewerWithControls
            workspaceId={workspaceId}
            logFiles={reconcileLogFiles}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
