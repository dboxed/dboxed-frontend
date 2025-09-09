import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router"
import type { ColumnDef } from "@tanstack/react-table"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx";
import type { components } from "@/api/models/schema";
import { Badge } from "@/components/ui/badge.tsx";
import { BaseListPage } from "@/pages/base";
import { ReferenceLabel } from "@/components/ReferenceLabel.tsx";

export function ListBoxesPage() {
  const navigate = useNavigate()
  const { workspaceId } = useSelectedWorkspaceId()

  // Define columns for the DataTable
  const columns: ColumnDef<components["schemas"]["Box"]>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const name = row.getValue("name") as string
        const id = row.original.id
        return (
          <button
            onClick={() => navigate(`/workspaces/${workspaceId}/boxes/${id}`)}
            className="font-medium text-left hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
          >
            {name}
          </button>
        )
      },
    },
    {
      accessorKey: "network",
      header: "Network",
      cell: ({ row }) => {
        const networkId = row.getValue("network") as number | null
        const networkType = row.original.network_type
        const workspaceId = row.original.workspace

        return (
          <div className="flex items-center gap-2">
            <ReferenceLabel
              resourceId={networkId}
              resourcePath="/v1/workspaces/{workspaceId}/networks/{id}"
              pathParams={{
                workspaceId: workspaceId,
                id: networkId
              }}
              detailsUrl={`/workspaces/${workspaceId}/networks/${networkId}`}
              fallbackLabel="Network"
              className="text-blue-600 hover:text-blue-800 underline text-sm"
            />
            {networkType && (
              <Badge variant="outline" className="text-xs">
                {networkType}
              </Badge>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "machine",
      header: "Machine",
      cell: ({ row }) => {
        const machineId = row.getValue("machine") as number | null
        const workspaceId = row.original.workspace

        if (!machineId) {
          return (
            <div className="text-sm text-muted-foreground">
              N/A
            </div>
          )
        }

        return (
          <ReferenceLabel
            resourceId={machineId}
            resourcePath="/v1/workspaces/{workspaceId}/machines/{id}"
            pathParams={{
              workspaceId: workspaceId,
              id: machineId
            }}
            detailsUrl={`/workspaces/${workspaceId}/machines/${machineId}`}
            fallbackLabel="Machine"
            className="text-blue-600 hover:text-blue-800 underline text-sm"
          />
        )
      },
    },
    {
      accessorKey: "dboxed_version",
      header: "Version",
      cell: ({ row }) => {
        const version = row.getValue("dboxed_version") as string
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
            onClick={() => navigate(`/workspaces/${workspaceId}/boxes/${id}`)}
          >
            View Details
          </Button>
        )
      },
    },
  ]

  return (
    <BaseListPage<components["schemas"]["Box"]>
      title="Boxes"
      resourcePath="/v1/workspaces/{workspaceId}/boxes"
      createPath={`/workspaces/${workspaceId}/boxes/create`}
      createButtonText="Create Box"
      columns={columns}
      apiParams={{
        path: {
          workspaceId: workspaceId,
        }
      }}
      emptyStateMessage="No boxes created yet. Create your first box to get started."
      searchColumn="name"
      searchPlaceholder="Search boxes..."
    />
  )
} 