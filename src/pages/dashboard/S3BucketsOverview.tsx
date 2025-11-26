import { useNavigate } from "react-router"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { useDboxedQueryClient } from "@/api/dboxed-api.ts"
import { Database } from "lucide-react"
import type { components } from "@/api/models/dboxed-schema"
import { WorkspaceOverviewCard } from "@/pages/dashboard/WorkspaceOverviewCard.tsx"
import { CreateS3BucketDialog } from "@/pages/s3-buckets/create/CreateS3BucketDialog.tsx"
import { StatusBadge } from "@/components/StatusBadge.tsx"
import { Badge } from "@/components/ui/badge.tsx"

export function S3BucketsOverview() {
  const navigate = useNavigate()
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useDboxedQueryClient()

  // Fetch S3 buckets
  const s3BucketsQuery = client.useQuery('get', '/v1/workspaces/{workspaceId}/s3-buckets', {
    params: {
      path: {
        workspaceId: workspaceId!,
      }
    }
  }, {
    refetchInterval: 10000,
  })

  const s3Buckets = s3BucketsQuery.data?.items || []

  // Get recent items (last 3)
  const recentS3Buckets = s3Buckets
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3)

  const items = recentS3Buckets.map((bucket: components["schemas"]["S3Bucket"]) => ({
    id: bucket.id,
    content: (
      <div
        className="flex items-center justify-between p-2 border rounded-md hover:bg-accent cursor-pointer"
        onClick={() => navigate(`/workspaces/${workspaceId}/s3-buckets/${bucket.id}`)}
      >
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium">{bucket.bucket}</div>
          {bucket.endpoint && (
            <Badge variant="outline" className="text-xs font-mono">
              {bucket.endpoint}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge item={bucket}/>
        </div>
      </div>
    ),
  }))

  return (
    <>
      <WorkspaceOverviewCard
        icon={<Database className="h-5 w-5" />}
        title="S3 Buckets"
        description="Your configured S3 buckets"
        count={s3Buckets.length}
        isLoading={s3BucketsQuery.isLoading}
        error={!!s3BucketsQuery.error}
        items={items}
        addNewDialog={CreateS3BucketDialog}
        emptyState={{
          message: "No S3 buckets configured yet",
          createButtonText: "Add First S3 Bucket",
        }}
        actions={{
          viewAllText: "View All",
          onViewAllClick: () => navigate(`/workspaces/${workspaceId}/s3-buckets`),
          addNewText: "Add New",
        }}
      />
    </>
  )
}
