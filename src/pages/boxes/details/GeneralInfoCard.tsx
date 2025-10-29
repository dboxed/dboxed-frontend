import { useEffect, useState } from "react"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { useDboxedQueryClient } from "@/api/api.ts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.tsx"
import { Badge } from "@/components/ui/badge.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip.tsx"
import { FileText, ScrollText } from "lucide-react"
import { ReferenceLabel } from "@/components/ReferenceLabel.tsx"
import { LabelAndValue } from "@/components/LabelAndValue.tsx"
import { DetailsCardLayout } from "@/components/DetailsCardLayout.tsx"
import { ContainerLogsDialog } from "./status/ContainerLogsDialog.tsx"
import { ReconcileLogsDialog } from "./status/ReconcileLogsDialog.tsx"
import { StatusBadge } from "@/components/StatusBadge.tsx"
import { TimeAgo } from "@/components/TimeAgo.tsx"
import type { components } from "@/api/models/schema"

interface GeneralInfoCardProps {
  data: components["schemas"]["Box"]
}

interface DockerContainer {
  Command: string
  CreatedAt: string
  ID: string
  Image: string
  Labels: string
  Names: string
  Networks: string
  State: string
  Status: string
  Ports?: string
  RunningFor?: string
}

async function decompressDockerPs(compressedData: string): Promise<DockerContainer[]> {
  try {
    // Decode base64
    const binaryString = atob(compressedData)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }

    // Decompress using DecompressionStream
    const stream = new Response(bytes).body
    if (!stream) {
      return []
    }

    const decompressedStream = stream.pipeThrough(new DecompressionStream('gzip'))
    const decompressedResponse = new Response(decompressedStream)
    const decompressedText = await decompressedResponse.text()

    // Parse JSON lines
    const lines = decompressedText.trim().split('\n')
    const containers: DockerContainer[] = []

    for (const line of lines) {
      if (line.trim()) {
        try {
          containers.push(JSON.parse(line))
        } catch (e) {
          console.error('Failed to parse container line:', e)
        }
      }
    }

    return containers
  } catch (error) {
    console.error('Failed to decompress docker ps data:', error)
    return []
  }
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

export function GeneralInfoCard({ data }: GeneralInfoCardProps) {
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useDboxedQueryClient()
  const [containers, setContainers] = useState<DockerContainer[]>([])
  const [selectedContainerForLogs, setSelectedContainerForLogs] = useState<string | null>(null)
  const [showReconcileLogs, setShowReconcileLogs] = useState(false)

  const { data: sandboxStatus } = client.useQuery('get', "/v1/workspaces/{workspaceId}/boxes/{id}/sandbox-status", {
    params: {
      path: {
        workspaceId: workspaceId!,
        id: data.id,
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>General Information</CardTitle>
          <CardDescription>
            Basic box details and configuration.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DetailsCardLayout>
            <LabelAndValue
              label="Name"
              textValue={data.name}
            />

            <LabelAndValue
              label="Workspace"
              value={
                <ReferenceLabel
                  resourceId={data.workspace}
                  resourcePath="/v1/workspaces/{workspaceId}"
                  pathParams={{ workspaceId: data.workspace }}
                  detailsUrl={`/workspaces/${data.workspace}`}
                  fallbackLabel="Workspace"
                />
              }
            />

            <LabelAndValue
              label="Dboxed Version"
              value={
                <Badge variant="outline" className="w-fit">
                  {data.dboxedVersion}
                </Badge>
              }
            />

            <LabelAndValue
              label="Network"
              value={
                <ReferenceLabel
                  resourceId={data.network}
                  resourcePath="/v1/workspaces/{workspaceId}/networks/{id}"
                  pathParams={{
                    workspaceId: data.workspace,
                    id: data.network
                  }}
                  detailsUrl={`/workspaces/${data.workspace}/networks/${data.network}`}
                  fallbackLabel="Network"
                />
              }
            />

            <LabelAndValue
              label="Machine"
              value={
                data.machine ? (
                  <ReferenceLabel
                    resourceId={data.machine}
                    resourcePath="/v1/workspaces/{workspaceId}/machines/{id}"
                    pathParams={{
                      workspaceId: data.workspace,
                      id: data.machine
                    }}
                    detailsUrl={`/workspaces/${data.workspace}/machines/${data.machine}`}
                    fallbackLabel="Machine"
                  />
                ) : (
                  <span className="text-muted-foreground">No machine assigned</span>
                )
              }
            />

            <LabelAndValue
              label="Created At"
              textValue={new Date(data.createdAt).toLocaleString()}
            />
          </DetailsCardLayout>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Sandbox Status</CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowReconcileLogs(true)}
                  >
                    <ScrollText className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View reconcile logs</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Desired State</div>
                <div className="text-lg">
                  <Badge variant={data.desiredState === 'up' ? 'default' : 'outline'} className="capitalize">
                    {data.desiredState}
                  </Badge>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-muted-foreground">Actual Status</div>
                <div className="text-lg">
                  {sandboxStatus?.runStatus ? (
                    <StatusBadge
                      item={{
                        status: sandboxStatus.runStatus,
                      }}
                    />
                  ) : (
                    <span className="text-muted-foreground">Unknown</span>
                  )}
                </div>
              </div>

              {sandboxStatus?.statusTime && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Status Time</div>
                  <div className="text-lg">
                    <TimeAgo date={sandboxStatus.statusTime} />
                  </div>
                </div>
              )}

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
          boxId={data.id}
          open={!!selectedContainerForLogs}
          onOpenChange={(open) => !open && setSelectedContainerForLogs(null)}
        />
      )}

      <ReconcileLogsDialog
        boxId={data.id}
        open={showReconcileLogs}
        onOpenChange={setShowReconcileLogs}
      />
    </div>
  )
} 