import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router"
import type { ColumnDef } from "@tanstack/react-table"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import type { components } from "@/api/models/dboxed-schema"
import { BaseListPage } from "@/pages/base"
import { CreateS3BucketDialog } from "./create/CreateS3BucketDialog.tsx"
import { StatusBadge } from "@/components/StatusBadge.tsx"
import { TimeAgo } from "@/components/TimeAgo.tsx"

export function ListS3BucketsPage() {
  const navigate = useNavigate()
  const { workspaceId } = useSelectedWorkspaceId()

  // Define columns for the DataTable
  const columns: ColumnDef<components["schemas"]["S3Bucket"]>[] = [
    {
      accessorKey: "bucket",
      header: "Bucket Name",
      cell: ({ row }) => {
        const bucket = row.getValue("bucket") as string
        const id = row.original.id
        return (
          <button
            onClick={() => navigate(`/workspaces/${workspaceId}/s3-buckets/${id}`)}
            className="font-medium text-left hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
          >
            {bucket}
          </button>
        )
      },
    },
    {
      accessorKey: "endpoint",
      header: "Endpoint",
      cell: ({ row }) => {
        const endpoint = row.getValue("endpoint") as string
        return (
          <div className="text-sm text-muted-foreground font-mono">
            {endpoint}
          </div>
        )
      },
    },
    {
      accessorKey: "determinedRegion",
      header: "Region",
      cell: ({ row }) => {
        const region = row.getValue("determinedRegion") as string | null
        return region ? (
          <span className="text-sm">{region}</span>
        ) : (
          <span className="text-sm text-muted-foreground">—</span>
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
            onClick={() => navigate(`/workspaces/${workspaceId}/s3-buckets/${id}`)}
          >
            View Details
          </Button>
        )
      },
    },
  ]

  return (
    <BaseListPage<components["schemas"]["S3Bucket"]>
      title="S3 Buckets"
      resourcePath="/v1/workspaces/{workspaceId}/s3-buckets"
      createDialog={CreateS3BucketDialog}
      createButtonText={"Add S3 Bucket"}
      columns={columns}
      apiParams={{
        path: {
          workspaceId: workspaceId,
        }
      }}
      emptyStateMessage="No S3 buckets configured yet. Add your first S3 bucket to get started."
      searchColumn="bucket"
      searchPlaceholder="Search buckets..."
    />
  )
}
