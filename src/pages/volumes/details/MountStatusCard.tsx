import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { ReferenceLabel } from "@/components/ReferenceLabel.tsx"
import { LabelAndValue } from "@/components/LabelAndValue.tsx"
import { DetailsCardLayout } from "@/components/DetailsCardLayout.tsx"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { VolumeMountBadge } from "@/pages/volumes/details/VolumeMountBadge.tsx"
import { TimeAgo } from "@/components/TimeAgo.tsx"
import { useDboxedQueryClient } from "@/api/client.ts"
import type { components } from "@/api/models/dboxed-schema"
import { formatSize } from "@/utils/size.ts"
import { SnapshotStatusCell } from "./SnapshotStatusCell.tsx"

interface MountStatusCardProps {
  volumeId: string
}

export function MountStatusCard({ volumeId }: MountStatusCardProps) {
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useDboxedQueryClient()

  // Fetch mount status with auto-refresh every 5 seconds
  const { data: mountStatus } = client.useQuery(
    'get',
    '/v1/workspaces/{workspaceId}/volumes/{id}/mount-status',
    {
      params: {
        path: {
          workspaceId: workspaceId!,
          id: volumeId,
        }
      }
    },
    {
      refetchInterval: 5000, // Refresh every 5 seconds
    }
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mount Status</CardTitle>
        <CardDescription>
          Current mount information for this volume.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DetailsCardLayout>
          <LabelAndValue
            label="Status"
            value={<VolumeMountBadge mountStatus={mountStatus} />}
          />
          <LabelAndValue
            label="Mounted By"
            value={
              <ReferenceLabel<components["schemas"]["Box"]>
                resourceId={mountStatus?.boxId}
                resourcePath="/v1/workspaces/{workspaceId}/boxes/{id}"
                pathParams={{
                  workspaceId: workspaceId,
                  id: mountStatus?.boxId
                }}
                detailsUrl={(box) => `/workspaces/${workspaceId}/boxes/${box.id}`}
                fallbackLabel="Box"
                className="text-blue-600 hover:text-blue-800 underline"
              />
            }
          />
          <LabelAndValue
            label="Mounted"
            value={<TimeAgo date={mountStatus?.mountTime} />}
          />
          <LabelAndValue
            label="Snapshot Status"
            value={<SnapshotStatusCell mountStatus={mountStatus} volumeId={volumeId} />}
          />
          <LabelAndValue
            label="Total Size"
            textValue={mountStatus?.volumeTotalSize ? `${formatSize(mountStatus.volumeTotalSize)}` : "N/A"}
          />
          <LabelAndValue
            label="Free Size"
            textValue={mountStatus?.volumeFreeSize ? `${formatSize(mountStatus.volumeFreeSize)} (${(mountStatus.volumeFreeSize / mountStatus.volumeTotalSize! * 100).toFixed(2)}%)` : "N/A"}
          />
        </DetailsCardLayout>
      </CardContent>
    </Card>
  )
}
