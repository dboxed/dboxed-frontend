import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router"
import type { ColumnDef } from "@tanstack/react-table"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx";
import type { components } from "@/api/models/schema";
import { Badge } from "@/components/ui/badge.tsx";
import { BaseListPage } from "@/pages/base";
import { ReferenceLabel } from "@/components/ReferenceLabel.tsx";

export function ListMachinesPage() {
  const navigate = useNavigate()
  const { workspaceId } = useSelectedWorkspaceId()

  // Define columns for the DataTable
  const columns: ColumnDef<components["schemas"]["Machine"]>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const name = row.getValue("name") as string
        const id = row.original.id
        return (
          <button
            onClick={() => navigate(`/workspaces/${workspaceId}/machines/${id}`)}
            className="font-medium text-left hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
          >
            {name}
          </button>
        )
      },
    },
    {
      accessorKey: "cloud_provider",
      header: "Cloud Provider",
      cell: ({ row }) => {
        const cloudProviderId = row.getValue("cloud_provider") as number | null
        const workspaceId = row.original.workspace
        const providerType = row.original.cloud_provider_type
        
        return (
          <div className="flex items-center gap-2">
            <ReferenceLabel
              resourceId={cloudProviderId}
              resourcePath="/v1/workspaces/{workspaceId}/cloud-providers/{id}"
              pathParams={{ 
                workspaceId: workspaceId, 
                id: cloudProviderId 
              }}
              detailsUrl={`/workspaces/${workspaceId}/cloud-providers/${cloudProviderId}`}
              fallbackLabel="Provider"
              className="text-blue-600 hover:text-blue-800 underline text-sm"
            />
            {providerType && (
              <Badge variant="outline" className="text-xs">
                {providerType}
              </Badge>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "unboxed_version",
      header: "Version",
      cell: ({ row }) => {
        const version = row.getValue("unboxed_version") as string
        return (
          <div className="text-sm text-muted-foreground font-mono">
            {version}
          </div>
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
            onClick={() => navigate(`/workspaces/${workspaceId}/machines/${id}`)}
          >
            View Details
          </Button>
        )
      },
    },
  ]

  return (
    <BaseListPage<components["schemas"]["Machine"]>
      title="Machines"
      resourcePath="/v1/workspaces/{workspaceId}/machines"
      createPath={`/workspaces/${workspaceId}/machines/create`}
      columns={columns}
      apiParams={{
        path: {
          workspaceId: workspaceId,
        }
      }}
      emptyStateMessage="No machines created yet. Create your first machine to get started."
      searchColumn="name"
      searchPlaceholder="Search machines..."
    />
  )
} 