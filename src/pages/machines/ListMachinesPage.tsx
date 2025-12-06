import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router"
import type { ColumnDef } from "@tanstack/react-table"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx";
import type { components } from "@/api/models/dboxed-schema";
import { Badge } from "@/components/ui/badge.tsx";
import { BaseListPage } from "@/pages/base";
import { ReferenceLabel } from "@/components/ReferenceLabel.tsx";
import { CreateMachineDialog } from "./create/CreateMachineDialog.tsx";
import { MachineStatusBadge } from "./details/status/MachineStatusBadge.tsx";
import { TimeAgo } from "@/components/TimeAgo.tsx";

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
      accessorKey: "machineProvider",
      header: "Machine Provider",
      cell: ({ row }) => {
        const machineProviderId = row.getValue("machineProvider") as number
        const workspaceId = row.original.workspace
        const providerType = row.original.machineProviderType
        
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
            <Badge variant="outline" className="text-xs">
              {providerType}
            </Badge>
          </div>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        return (
          <MachineStatusBadge machine={row.original}/>
        )
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => {
        const createdAt = row.getValue("createdAt") as string
        return <TimeAgo date={createdAt} className="text-sm" />
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
      createDialog={CreateMachineDialog}
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