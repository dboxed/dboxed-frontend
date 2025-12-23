import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router"
import type { ColumnDef } from "@tanstack/react-table"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import type { components } from "@/api/models/dboxed-schema"
import { BaseListPage } from "@/pages/base"
import { TimeAgo } from "@/components/TimeAgo.tsx"
import { CreateDboxedSpecDialog } from "@/pages/dboxed-specs/create"
import { StatusBadge } from "@/components/StatusBadge.tsx";

export function ListDboxedSpecsPage() {
  const navigate = useNavigate()
  const { workspaceId } = useSelectedWorkspaceId()

  const columns: ColumnDef<components["schemas"]["DboxedSpec"]>[] = [
    {
      accessorKey: "gitUrl",
      header: "Git URL",
      cell: ({ row }) => {
        const gitUrl = row.getValue("gitUrl") as string
        const id = row.original.id
        return (
          <button
            onClick={() => navigate(`/workspaces/${workspaceId}/dboxed-specs/${id}`)}
            className="font-medium text-left hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded font-mono text-sm"
          >
            {gitUrl}
          </button>
        )
      },
    },
    {
      accessorKey: "specFile",
      header: "Spec File",
      cell: ({ row }) => {
        const specFile = row.getValue("specFile") as string
        return <span className="font-mono text-sm">{specFile}</span>
      },
    },
    {
      accessorKey: "subdir",
      header: "Subdirectory",
      cell: ({ row }) => {
        const subdir = row.getValue("subdir") as string
        return subdir ? (
          <span className="font-mono text-sm">{subdir}</span>
        ) : (
          <span className="text-muted-foreground">—</span>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        return (
          <StatusBadge item={row.original}/>
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
            onClick={() => navigate(`/workspaces/${workspaceId}/dboxed-specs/${id}`)}
          >
            View Details
          </Button>
        )
      },
    },
  ]

  return (
    <BaseListPage<components["schemas"]["DboxedSpec"]>
      title="Specs"
      resourcePath="/v1/workspaces/{workspaceId}/dboxed-specs"
      createDialog={CreateDboxedSpecDialog}
      columns={columns}
      apiParams={{
        path: {
          workspaceId: workspaceId,
        }
      }}
      emptyStateMessage="No specs configured yet. Create your first dboxed spec to get started."
      searchColumn="gitUrl"
      searchPlaceholder="Search specs..."
    />
  )
}
