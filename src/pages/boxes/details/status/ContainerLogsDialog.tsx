import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { useDboxedQueryClient } from "@/api/api.ts"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog.tsx"
import { LogViewerWithControls } from "../logs/LogViewerWithControls.tsx"

interface ContainerLogsDialogProps {
  containerName: string
  boxId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ContainerLogsDialog({ containerName, boxId, open, onOpenChange }: ContainerLogsDialogProps) {
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useDboxedQueryClient()

  // Fetch available log files
  const logFiles = client.useQuery('get', "/v1/workspaces/{workspaceId}/boxes/{id}/logs", {
    params: {
      path: {
        workspaceId: workspaceId!,
        id: boxId,
      }
    },
  }, {
    enabled: open && !!workspaceId,
    refetchInterval: 10000,
  })

  // Filter log files for this container
  const containerLogFiles = logFiles.data?.items?.filter(logFile => {
    // Extract name from path: "containers/name/..." -> "name"
    const parts = logFile.fileName.split('/')
    if (parts.length >= 2 && parts[0] === 'containers') {
      return parts[1] === containerName
    }
    return false
  }) || []

  if (!workspaceId) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-[80%] max-h-[80%]">
        <DialogHeader>
          <DialogTitle>Container Logs: {containerName}</DialogTitle>
        </DialogHeader>

        {containerLogFiles.length === 0 ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            No log files found for this container
          </div>
        ) : (
          <LogViewerWithControls
            workspaceId={workspaceId}
            boxId={boxId}
            logFiles={containerLogFiles}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
