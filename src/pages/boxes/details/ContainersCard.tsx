import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip.tsx"
import { FileText } from "lucide-react"
import { StatusBadge } from "@/components/StatusBadge.tsx"
import type { components } from "@/api/models/schema"
import { decompressDockerPs, type DockerContainer } from "@/pages/boxes/docker-utils.tsx"
import { ContainerLogsDialog } from "./status/ContainerLogsDialog.tsx"

interface ContainersCardProps {
  sandboxStatus?: components["schemas"]["BoxSandboxStatus"]
  boxId: number
}

export function ContainersCard({ sandboxStatus, boxId }: ContainersCardProps) {
  const [containers, setContainers] = useState<DockerContainer[]>([])
  const [selectedContainerForLogs, setSelectedContainerForLogs] = useState<string | null>(null)

  useEffect(() => {
    if (sandboxStatus?.dockerPs) {
      decompressDockerPs(sandboxStatus.dockerPs).then(setContainers)
    } else {
      setContainers([])
    }
  }, [sandboxStatus?.dockerPs])

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Docker Containers</CardTitle>
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
          boxId={boxId}
          open={!!selectedContainerForLogs}
          onOpenChange={(open) => !open && setSelectedContainerForLogs(null)}
        />
      )}
    </>
  )
}
