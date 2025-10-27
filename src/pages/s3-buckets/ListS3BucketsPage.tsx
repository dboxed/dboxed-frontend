import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router"
import type { ColumnDef } from "@tanstack/react-table"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import type { components } from "@/api/models/schema"
import { Badge } from "@/components/ui/badge.tsx"
import { BaseListPage } from "@/pages/base"
import { CreateS3BucketDialog } from "./create/CreateS3BucketDialog.tsx"

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
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        const variant = status === "ok" ? "default" : status === "error" ? "destructive" : "secondary"
        return (
          <Badge variant={variant}>
            {status}
          </Badge>
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
      emptyStateMessage="No S3 buckets configured yet. Create your first S3 bucket to get started."
      searchColumn="bucket"
      searchPlaceholder="Search buckets..."
    />
  )
}
