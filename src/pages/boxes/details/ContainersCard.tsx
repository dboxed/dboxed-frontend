import { useEffect, useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip.tsx"
import { FileText, AlertTriangle } from "lucide-react"
import { StatusBadge } from "@/components/StatusBadge.tsx"
import type { components } from "@/api/models/schema"
import { decompressDockerPs, type DockerContainer } from "@/pages/boxes/docker-utils.tsx"
import { ContainerLogsDialog } from "./status/ContainerLogsDialog.tsx"
import { DataTable } from "@/components/data-table.tsx"
import type { ColumnDef } from "@tanstack/react-table"
import { isStatusStale, formatTimeAgo } from "@/utils/time.ts"

interface ContainersCardProps {
  sandboxStatus?: components["schemas"]["BoxSandboxStatus"]
  boxId: string
}

export function ContainersCard({ sandboxStatus, boxId }: ContainersCardProps) {
  const [containers, setContainers] = useState<DockerContainer[]>([])
  const [selectedContainerForLogs, setSelectedContainerForLogs] = useState<string | null>(null)

  const statusTime = sandboxStatus?.statusTime
  const isStale = !statusTime || isStatusStale(statusTime)

  useEffect(() => {
    if (sandboxStatus?.dockerPs) {
      decompressDockerPs(sandboxStatus.dockerPs).then(setContainers)
    } else {
      setContainers([])
    }
  }, [sandboxStatus?.dockerPs])

  const columns = useMemo<ColumnDef<DockerContainer>[]>(() => [
    {
      accessorKey: "Names",
      header: "Name",
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("Names")}</span>
      ),
    },
    {
      accessorKey: "Image",
      header: "Image",
    },
    {
      accessorKey: "State",
      header: "State",
      cell: ({ row }) => (
        <StatusBadge
          item={{
            status: row.getValue("State"),
          }}
        />
      ),
    },
    {
      accessorKey: "Status",
      header: "Status",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">{row.getValue("Status")}</span>
      ),
    },
    {
      accessorKey: "Ports",
      header: "Ports",
      cell: ({ row }) => (
        <span className="text-sm">{row.getValue("Ports") || '-'}</span>
      ),
    },
    {
      accessorKey: "ID",
      header: "ID",
      cell: ({ row }) => {
        const id = row.getValue("ID") as string
        return <span className="font-mono text-xs">{id.substring(0, 12)}</span>
      },
    },
    {
      id: "actions",
      header: "Logs",
      cell: ({ row }) => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedContainerForLogs(row.original.Names)}
              >
                <FileText className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View logs</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
    },
  ], [setSelectedContainerForLogs])

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Docker Containers</CardTitle>
            {isStale && (
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Container information is stale and may not be up-to-date.
                  {statusTime && ` Last updated ${formatTimeAgo(statusTime)}.`}
                </span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={containers} />
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
