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
      accessorKey: "box",
      header: "Box",
      cell: ({ row }) => {
        const boxId = row.getValue("box") as number
        const workspaceId = row.original.workspace

        return (
          <ReferenceLabel
            resourceId={boxId}
            resourcePath="/v1/workspaces/{workspaceId}/boxes/{id}"
            pathParams={{
              workspaceId: workspaceId,
              id: boxId
            }}
            detailsUrl={`/workspaces/${workspaceId}/boxes/${boxId}`}
            fallbackLabel="Box"
            className="text-blue-600 hover:text-blue-800 underline text-sm"
          />
        )
      },
    },
    {
      accessorKey: "machine_provider",
      header: "Machine Provider",
      cell: ({ row }) => {
        const machineProviderId = row.getValue("machine_provider") as number | null
        const workspaceId = row.original.workspace
        const providerType = row.original.machine_provider_type
        
        return (
          <div className="flex items-center gap-2">
            <ReferenceLabel
              resourceId={machineProviderId}
              resourcePath="/v1/workspaces/{workspaceId}/machine-providers/{id}"
              pathParams={{ 
                workspaceId: workspaceId, 
                id: machineProviderId
              }}
              detailsUrl={`/workspaces/${workspaceId}/machine-providers/${machineProviderId}`}
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