import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { useDboxedQueryClient } from "@/api/api.ts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.tsx"
import { Badge } from "@/components/ui/badge.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip.tsx"
import { FileText } from "lucide-react"
import type { components } from "@/api/models/schema"
import { useEffect, useState } from "react"
import { ContainerLogsDialog } from "./ContainerLogsDialog.tsx"
import { decompressDockerPs, type DockerContainer } from "../../docker-utils.tsx"

interface StatusTabProps {
  box: components["schemas"]["Box"]
}

function getStateColor(state: string): "default" | "destructive" | "outline" | "secondary" | "success" {
  switch (state.toLowerCase()) {
    case 'running':
      return 'success'
    case 'exited':
      return 'destructive'
    case 'paused':
      return 'secondary'
    default:
      return 'outline'
  }
}

export function StatusTab({ box }: StatusTabProps) {
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useDboxedQueryClient()
  const [containers, setContainers] = useState<DockerContainer[]>([])
  const [selectedContainerForLogs, setSelectedContainerForLogs] = useState<string | null>(null)

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

  useEffect(() => {
    if (sandboxStatus?.dockerPs) {
      decompressDockerPs(sandboxStatus.dockerPs).then(setContainers)
    } else {
      setContainers([])
    }
  }, [sandboxStatus?.dockerPs])

  if (!workspaceId) {
    return <>no workspace</>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Run Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Status</div>
                <div className="text-lg">
                  {sandboxStatus?.runStatus ? (
                    <Badge variant={sandboxStatus.runStatus === 'running' ? 'success' : 'secondary'}>
                      {sandboxStatus.runStatus}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">Unknown</span>
                  )}
                </div>
              </div>

              {sandboxStatus?.startTime && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Start Time</div>
                  <div className="text-lg">{new Date(sandboxStatus.startTime).toLocaleString()}</div>
                </div>
              )}

              {sandboxStatus?.stopTime && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Stop Time</div>
                  <div className="text-lg">{new Date(sandboxStatus.stopTime).toLocaleString()}</div>
                </div>
              )}

              {sandboxStatus?.statusTime && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Status Time</div>
                  <div className="text-lg">{new Date(sandboxStatus.statusTime).toLocaleString()}</div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Docker Containers ({containers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {containers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ports</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead className="w-24">Logs</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {containers.map((container) => (
                  <TableRow key={container.ID}>
                    <TableCell className="font-medium">{container.Names}</TableCell>
                    <TableCell>{container.Image}</TableCell>
                    <TableCell>
                      <Badge variant={getStateColor(container.State)}>
                        {container.State}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {container.Status}
                    </TableCell>
                    <TableCell className="text-sm">
                      {container.Ports || '-'}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {container.ID.substring(0, 12)}
                    </TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedContainerForLogs(container.Names)}
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View logs</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              No containers running
            </div>
          )}
        </CardContent>
      </Card>

      {selectedContainerForLogs && (
        <ContainerLogsDialog
          containerName={selectedContainerForLogs}
          boxId={box.id}
          open={!!selectedContainerForLogs}
          onOpenChange={(open) => !open && setSelectedContainerForLogs(null)}
        />
      )}
    </div>
  )
}
