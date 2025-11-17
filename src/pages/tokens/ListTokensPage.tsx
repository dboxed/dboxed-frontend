import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router"
import type { ColumnDef } from "@tanstack/react-table"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx";
import type { components } from "@/api/models/schema";
import { BaseListPage } from "@/pages/base";
import { CreateTokenDialog } from "./create/CreateTokenDialog.tsx";
import { TimeAgo } from "@/components/TimeAgo.tsx";
import { TokenScopeBadge } from "./TokenScopeBadge.tsx";

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
      id: "scope",
      header: "Scope",
      cell: ({ row }) => {
        return <TokenScopeBadge token={row.original} />
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
      createDialog={CreateTokenDialog}
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