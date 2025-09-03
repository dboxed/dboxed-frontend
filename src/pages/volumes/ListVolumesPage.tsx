import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router"
import type { ColumnDef } from "@tanstack/react-table"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx";
import type { components } from "@/api/models/schema";
import { Badge } from "@/components/ui/badge.tsx";
import { BaseListPage } from "@/pages/base";
import { ReferenceLabel } from "@/components/ReferenceLabel.tsx";

export function ListVolumesPage() {
  const navigate = useNavigate()
  const { workspaceId } = useSelectedWorkspaceId()

  // Define columns for the DataTable
  const columns: ColumnDef<components["schemas"]["Volume"]>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const name = row.getValue("name") as string
        const id = row.original.id
        return (
          <button
            onClick={() => navigate(`/workspaces/${workspaceId}/volumes/${id}`)}
            className="font-medium text-left hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
          >
            {name}
          </button>
        )
      },
    },
    {
      accessorKey: "volume_provider_type",
      header: "Provider Type",
      cell: ({ row }) => {
        const type = row.getValue("volume_provider_type") as string
        return (
          <Badge variant="secondary" className="capitalize">
            {type}
          </Badge>
        )
      },
    },
    {
      accessorKey: "volume_provider",
      header: "Volume Provider",
      cell: ({ row }) => {
        const providerId = row.getValue("volume_provider") as number
        return (
          <ReferenceLabel
            resourceId={providerId}
            resourcePath="/v1/workspaces/{workspaceId}/volume-providers/{id}"
            pathParams={{
              workspaceId: workspaceId,
              id: providerId
            }}
            detailsUrl={`/workspaces/${workspaceId}/volume-providers/${providerId}`}
            fallbackLabel="Volume Provider"
            className="text-blue-600 hover:text-blue-800 underline text-sm"
          />
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
            onClick={() => navigate(`/workspaces/${workspaceId}/volumes/${id}`)}
          >
            View Details
          </Button>
        )
      },
    },
  ]

  return (
    <BaseListPage<components["schemas"]["Volume"]>
      title="Volumes"
      resourcePath="/v1/workspaces/{workspaceId}/volumes"
      createPath={`/workspaces/${workspaceId}/volumes/create`}
      columns={columns}
      apiParams={{
        path: {
          workspaceId: workspaceId,
        }
      }}
      emptyStateMessage="No volumes configured yet. Create your first volume to get started."
      searchColumn="name"
      searchPlaceholder="Search volumes..."
    />
  )
}