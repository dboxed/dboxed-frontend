import { useEffect, useState } from "react"
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
import { TimeAgo } from "@/components/TimeAgo.tsx"
import { SandboxStatusBadge } from "@/pages/boxes/details/status/SandboxStatusBadge.tsx"
import { StatusBadge } from "@/components/StatusBadge.tsx"
import type { components } from "@/api/models/schema"
import { decompressDockerPs, type DockerContainer } from "@/pages/boxes/docker-utils.tsx";
import { useDboxedQueryClient } from "@/api/api.ts";

interface GeneralInfoCardProps {
  box: components["schemas"]["Box"]
}

export function GeneralInfoCard({ box }: GeneralInfoCardProps) {
  const client = useDboxedQueryClient()
  const [containers, setContainers] = useState<DockerContainer[]>([])
  const [selectedContainerForLogs, setSelectedContainerForLogs] = useState<string | null>(null)
  const [showReconcileLogs, setShowReconcileLogs] = useState(false)

  const { data: sandboxStatus } = client.useQuery('get', "/v1/workspaces/{workspaceId}/boxes/{id}/sandbox-status", {
    params: {
      path: {
        workspaceId: box.workspace!,
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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                textValue={box.name}
              />

              <LabelAndValue
                label="Workspace"
                value={
                  <ReferenceLabel
                    resourceId={box.workspace}
                    resourcePath="/v1/workspaces/{workspaceId}"
                    pathParams={{ workspaceId: box.workspace }}
                    detailsUrl={`/workspaces/${box.workspace}`}
                    fallbackLabel="Workspace"
                  />
                }
              />

              <LabelAndValue
                label="Dboxed Version"
                value={
                  <Badge variant="outline" className="w-fit">
                    {box.dboxedVersion}
                  </Badge>
                }
              />

              <LabelAndValue
                label="Network"
                value={
                  <ReferenceLabel
                    resourceId={box.network}
                    resourcePath="/v1/workspaces/{workspaceId}/networks/{id}"
                    pathParams={{
                      workspaceId: box.workspace,
                      id: box.network
                    }}
                    detailsUrl={`/workspaces/${box.workspace}/networks/${box.network}`}
                    fallbackLabel="Network"
                  />
                }
              />

              <LabelAndValue
                label="Machine"
                value={
                  box.machine ? (
                    <ReferenceLabel
                      resourceId={box.machine}
                      resourcePath="/v1/workspaces/{workspaceId}/machines/{id}"
                      pathParams={{
                        workspaceId: box.workspace,
                        id: box.machine
                      }}
                      detailsUrl={`/workspaces/${box.workspace}/machines/${box.machine}`}
                      fallbackLabel="Machine"
                    />
                  ) : (
                    <span className="text-muted-foreground">No machine assigned</span>
                  )
                }
              />

              <LabelAndValue
                label="Created"
                value={<TimeAgo date={box.createdAt} />}
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
            <DetailsCardLayout>
              <LabelAndValue
                label="Desired State"
                value={
                  <Badge variant={box.desiredState === 'up' ? 'default' : 'outline'} className="capitalize">
                    {box.desiredState}
                  </Badge>
                }
              />

              <LabelAndValue
                label="Status"
                value={
                  <div className="flex items-center gap-2">
                    <SandboxStatusBadge sandboxStatus={sandboxStatus} />
                  </div>
                }
              />

              {sandboxStatus?.startTime && (
                <LabelAndValue
                  label="Started"
                  value={<TimeAgo date={sandboxStatus?.startTime} />}
                />
              )}

              {sandboxStatus?.stopTime && (
                <LabelAndValue
                  label="Stopped"
                  value={<TimeAgo date={sandboxStatus?.stopTime} />}
                />
              )}
            </DetailsCardLayout>
          </CardContent>
        </Card>
      </div>

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
                      <StatusBadge
                        item={{
                          status: container.State,
                        }}
                      />
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

      <ReconcileLogsDialog
        boxId={box.id}
        open={showReconcileLogs}
        onOpenChange={setShowReconcileLogs}
      />
    </div>
  )
} 