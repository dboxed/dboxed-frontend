import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router"
import type { ColumnDef } from "@tanstack/react-table"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import type { components } from "@/api/models/dboxed-schema"
import { Badge } from "@/components/ui/badge.tsx"
import { BaseListPage } from "@/pages/base"
import { TimeAgo } from "@/components/TimeAgo.tsx"
import { CreateGitCredentialsDialog } from "./create/CreateGitCredentialsDialog.tsx"

export function ListGitCredentialsPage() {
  const navigate = useNavigate()
  const { workspaceId } = useSelectedWorkspaceId()

  const columns: ColumnDef<components["schemas"]["GitCredentials"]>[] = [
    {
      accessorKey: "host",
      header: "Host",
      cell: ({ row }) => {
        const host = row.getValue("host") as string
        const id = row.original.id
        return (
          <button
            onClick={() => navigate(`/workspaces/${workspaceId}/git-credentials/${id}`)}
            className="font-medium text-left hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
          >
            {host}
          </button>
        )
      },
    },
    {
      accessorKey: "pathGlob",
      header: "Path Glob",
      cell: ({ row }) => {
        const pathGlob = row.getValue("pathGlob") as string
        return pathGlob || <span className="text-muted-foreground">—</span>
      },
    },
    {
      accessorKey: "credentialsType",
      header: "Type",
      cell: ({ row }) => {
        const credentialsType = row.getValue("credentialsType") as string
        return (
          <Badge variant="secondary" className="capitalize">
            {credentialsType}
          </Badge>
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
            onClick={() => navigate(`/workspaces/${workspaceId}/git-credentials/${id}`)}
          >
            View Details
          </Button>
        )
      },
    },
  ]

  return (
    <BaseListPage<components["schemas"]["GitCredentials"]>
      title="Git Credentials"
      resourcePath="/v1/workspaces/{workspaceId}/git-credentials"
      createDialog={CreateGitCredentialsDialog}
      columns={columns}
      apiParams={{
        path: {
          workspaceId: workspaceId,
        }
      }}
      emptyStateMessage="No git credentials configured yet. Create your first credentials to get started."
      searchColumn="host"
      searchPlaceholder="Search credentials..."
    />
  )
}
