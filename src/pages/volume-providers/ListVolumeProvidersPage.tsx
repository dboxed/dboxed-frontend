import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router"
import type { ColumnDef } from "@tanstack/react-table"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx";
import type { components } from "@/api/models/schema";
import { Badge } from "@/components/ui/badge.tsx";
import { BaseListPage } from "@/pages/base";

export function ListVolumeProvidersPage() {
  const navigate = useNavigate()
  const { workspaceId } = useSelectedWorkspaceId()

  // Define columns for the DataTable
  const columns: ColumnDef<components["schemas"]["VolumeProvider"]>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const name = row.getValue("name") as string
        const id = row.original.id
        return (
          <button
            onClick={() => navigate(`/workspaces/${workspaceId}/volume-providers/${id}`)}
            className="font-medium text-left hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
          >
            {name}
          </button>
        )
      },
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const type = row.getValue("type") as string
        return (
          <Badge variant="secondary" className="capitalize">
            {type}
          </Badge>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        const getStatusVariant = (status: string) => {
          switch (status.toLowerCase()) {
            case 'active':
              return 'default'
            case 'pending':
              return 'secondary'
            case 'error':
              return 'destructive'
            default:
              return 'outline'
          }
        }
        return (
          <Badge variant={getStatusVariant(status)} className="capitalize">
            {status}
          </Badge>
        )
      },
    },
    {
      accessorKey: "created_at",
      header: "Created",
      cell: ({ row }) => {
        const date = new Date(row.getValue("created_at"))
        const formattedDate = date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
        return (
          <div className="text-sm text-muted-foreground">
            {formattedDate}
          </div>
        )
      },
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
            onClick={() => navigate(`/workspaces/${workspaceId}/volume-providers/${id}`)}
          >
            View Details
          </Button>
        )
      },
    },
  ]

  return (
    <BaseListPage<components["schemas"]["VolumeProvider"]>
      title="Volume Providers"
      resourcePath="/v1/workspaces/{workspaceId}/volume-providers"
      createPath={`/workspaces/${workspaceId}/volume-providers/create`}
      columns={columns}
      apiParams={{
        path: {
          workspaceId: workspaceId,
        }
      }}
      emptyStateMessage="No volume providers configured yet. Create your first volume provider to get started."
      searchColumn="name"
      searchPlaceholder="Search volume providers..."
    />
  )
}