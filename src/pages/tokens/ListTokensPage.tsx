import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router"
import type { ColumnDef } from "@tanstack/react-table"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx";
import type { components } from "@/api/models/schema";
import { Badge } from "@/components/ui/badge.tsx";
import { BaseListPage } from "@/pages/base";
import { ReferenceLabel } from "@/components/ReferenceLabel.tsx";

export function ListTokensPage() {
  const navigate = useNavigate()
  const { workspaceId } = useSelectedWorkspaceId()

  // Define columns for the DataTable
  const columns: ColumnDef<components["schemas"]["Token"]>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const name = row.getValue("name") as string
        const id = row.original.id
        return (
          <button
            onClick={() => navigate(`/workspaces/${workspaceId}/tokens/${id}`)}
            className="font-medium text-left hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
          >
            {name}
          </button>
        )
      },
    },
    {
      accessorKey: "forWorkspace",
      header: "Scope",
      cell: ({ row }) => {
        const forWorkspace = row.getValue("forWorkspace") as boolean
        return (
          <Badge variant={forWorkspace ? "default" : "secondary"}>
            {forWorkspace ? "Workspace" : "Box"}
          </Badge>
        )
      },
    },
    {
      accessorKey: "boxId",
      header: "Box",
      cell: ({ row }) => {
        const boxId = row.getValue("boxId") as number | null
        const workspaceId = row.original.workspace

        if (!boxId) {
          return (
            <div className="text-sm text-muted-foreground">
              N/A
            </div>
          )
        }

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
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"))
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
            onClick={() => navigate(`/workspaces/${workspaceId}/tokens/${id}`)}
          >
            View Details
          </Button>
        )
      },
    },
  ]

  return (
    <BaseListPage<components["schemas"]["Token"]>
      title="Tokens"
      resourcePath="/v1/workspaces/{workspaceId}/tokens"
      createPath={`/workspaces/${workspaceId}/tokens/create`}
      createButtonText="Create Token"
      columns={columns}
      apiParams={{
        path: {
          workspaceId: workspaceId,
        }
      }}
      emptyStateMessage="No tokens created yet. Create your first token to get started."
      searchColumn="name"
      searchPlaceholder="Search tokens..."
    />
  )
}