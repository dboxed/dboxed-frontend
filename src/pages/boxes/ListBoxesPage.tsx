import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router"
import type { ColumnDef } from "@tanstack/react-table"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx";
import type { components } from "@/api/models/schema";
import { Badge } from "@/components/ui/badge.tsx";
import { BaseListPage } from "@/pages/base";
import { ReferenceLabel } from "@/components/ReferenceLabel.tsx";
import { CreateBoxDialog } from "./create/CreateBoxDialog.tsx";
import { StatusBadge } from "@/components/StatusBadge.tsx";
import { TimeAgo } from "@/components/TimeAgo.tsx";
import { SandboxStatusBadge } from "@/pages/boxes/details/status/SandboxStatusBadge.tsx";
import { ContainerStatusBadge } from "@/pages/boxes/details/status/ContainerStatusBadge.tsx";

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
        const networkType = row.original.networkType
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
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        return (
          <StatusBadge
            item={{
              status: row.original.status,
              statusDetails: row.original.statusDetails
            }}
          />
        )
      },
    },
    {
      accessorKey: "desiredState",
      header: "Desired State",
      cell: ({ row }) => {
        const desiredState = row.getValue("desiredState") as string
        return (
          <Badge variant={desiredState === 'up' ? 'default' : 'outline'} className="capitalize">
            {desiredState}
          </Badge>
        )
      },
    },
    {
      id: "sandboxStatus",
      header: "Sandbox Status",
      cell: ({ row }) => {
        const sandboxStatus = row.original.sandboxStatus
        const box = row.original

        if (!sandboxStatus?.runStatus) {
          return <span className="text-sm text-muted-foreground">N/A</span>
        }

        return (
          <div className="flex items-center gap-2">
            <SandboxStatusBadge sandboxStatus={box.sandboxStatus} />
          </div>
        )
      },
    },
    {
      id: "containers",
      header: "Containers",
      cell: ({ row }) => {
        return <ContainerStatusBadge box={row.original} />
      },
    },
    {
      accessorKey: "dboxedVersion",
      header: "Version",
      cell: ({ row }) => {
        const version = row.getValue("dboxedVersion") as string
        return (
          <div className="text-sm text-muted-foreground font-mono">
            {version}
          </div>
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
            onClick={() => navigate(`/workspaces/${workspaceId}/boxes/${id}`)}
          >
            View Details
          </Button>
        )
      },
    },
  ]

  return (
    <>
      <BaseListPage<components["schemas"]["Box"]>
        title="Boxes"
        resourcePath="/v1/workspaces/{workspaceId}/boxes"
        createDialog={CreateBoxDialog}
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
    </>
  )
} 