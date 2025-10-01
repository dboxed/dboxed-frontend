import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Button } from "@/components/ui/button.tsx"
import { DataTable } from "@/components/data-table.tsx"
import { useDboxedQueryClient } from "@/api/api.ts"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { formatTimeAgo, formatDuration } from "@/utils/time.ts"
import type { components } from "@/api/models/schema"
import type { ColumnDef } from "@tanstack/react-table"
import { formatSize } from "@/utils/size.ts";

interface SnapshotsTabProps {
  volumeId: string
}

export function SnapshotsTab({ volumeId }: SnapshotsTabProps) {
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useDboxedQueryClient()

  const snapshotsQuery = client.useQuery(
    'get',
    '/v1/workspaces/{workspaceId}/volumes/{id}/snapshots',
    {
      params: {
        path: {
          workspaceId: workspaceId,
          id: volumeId
        }
      }
    }
  )

  const columns: ColumnDef<components["schemas"]["VolumeSnapshot"]>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => {
        const id = row.getValue("id") as number
        return <span className="font-mono text-sm">{id}</span>
      }
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => {
        const createdAt = row.getValue("createdAt") as string
        return (
          <div className="flex flex-col">
            <span className="text-sm">{formatTimeAgo(createdAt)}</span>
            <span className="text-xs text-muted-foreground">
              {new Date(createdAt).toLocaleString()}
            </span>
          </div>
        )
      }
    },
    {
      accessorKey: "rustic",
      header: "Backup Info",
      cell: ({ row }) => {
        const rustic = row.original.rustic
        if (!rustic) return <span className="text-sm text-muted-foreground">N/A</span>

        return (
          <div className="flex flex-col text-sm">
            <span>Files: {rustic.totalFilesProcessed} | Size: {formatSize(rustic.totalBytesProcessed)}</span>
            <span className="text-xs text-muted-foreground">
              Duration: {formatDuration(rustic.backupDuration)}
            </span>
          </div>
        )
      }
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const id = row.original.id
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // TODO: Implement snapshot restore/delete functionality
              console.log("Snapshot action:", id)
            }}
          >
            View
          </Button>
        )
      }
    }
  ]

  const snapshots = snapshotsQuery.data?.items || []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Snapshots</CardTitle>
        <CardDescription>
          Backup snapshots for this volume
        </CardDescription>
      </CardHeader>
      <CardContent>
        {snapshotsQuery.isLoading ? (
          <p className="text-sm text-muted-foreground">Loading snapshots...</p>
        ) : snapshotsQuery.error ? (
          <p className="text-sm text-destructive">Failed to load snapshots</p>
        ) : snapshots.length === 0 ? (
          <p className="text-sm text-muted-foreground">No snapshots found</p>
        ) : (
          <DataTable
            columns={columns}
            data={snapshots}
            searchColumn="id"
            searchPlaceholder="Search snapshots..."
          />
        )}
      </CardContent>
    </Card>
  )
}
