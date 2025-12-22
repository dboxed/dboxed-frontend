import { BaseResourceDetailsPage } from "@/pages/base/BaseResourceDetailsPage.tsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { useParams } from "react-router"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { LabelAndValue } from "@/components/LabelAndValue.tsx"
import { DetailsCardLayout } from "@/components/DetailsCardLayout.tsx"
import { formatDurationBetween } from "@/utils/time.ts"
import { TimeAgo } from "@/components/TimeAgo.tsx"
import { formatSize } from "@/utils/size.ts"
import type { components } from "@/api/models/dboxed-schema"

export function SnapshotDetailsPage() {
  const { workspaceId } = useSelectedWorkspaceId()
  const { volumeId, snapshotId } = useParams<{ volumeId: string; snapshotId: string }>()

  if (!volumeId || !snapshotId) {
    return <div>Invalid snapshot ID</div>
  }

  return (
    <BaseResourceDetailsPage<components["schemas"]["VolumeSnapshot"], any>
      title="Snapshot"
      resourcePath="/v1/workspaces/{workspaceId}/volumes/{id}/snapshots/{snapshotId}"
      enableDelete={true}
      afterDeleteUrl={`/workspaces/${workspaceId}/volumes/${volumeId}`}
      apiParams={{
        path: {
          workspaceId: workspaceId,
          id: volumeId,
          snapshotId: snapshotId,
        }
      }}
    >
      {(data) => (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
              <CardDescription>
                Basic information about this snapshot.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DetailsCardLayout>
                <LabelAndValue
                  label="Snapshot ID"
                  textValue={data.id.toString()}
                />
                <LabelAndValue
                  label="Created"
                  value={<TimeAgo date={data.createdAt} />}
                />
                <LabelAndValue
                  label="Mount ID"
                  textValue={data.mountId}
                />
              </DetailsCardLayout>
            </CardContent>
          </Card>

          {data.restic && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Backup Statistics</CardTitle>
                  <CardDescription>
                    Statistics from the backup operation.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DetailsCardLayout>
                    <LabelAndValue
                      label="Snapshot ID (Restic)"
                      textValue={data.restic.snapshotId}
                    />
                    <LabelAndValue
                      label="Hostname"
                      textValue={data.restic.hostname}
                    />
                    <LabelAndValue
                      label="Parent Snapshot"
                      textValue={data.restic.parentSnapshotId || "None"}
                    />
                    <LabelAndValue
                      label="Snapshot Time"
                      value={<TimeAgo date={data.restic.snapshotTime} />}
                    />
                  </DetailsCardLayout>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Files & Directories</CardTitle>
                  <CardDescription>
                    Summary of files and directories processed.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DetailsCardLayout>
                    <LabelAndValue
                      label="Total Files Processed"
                      textValue={data.restic.totalFilesProcessed.toLocaleString()}
                    />
                    <LabelAndValue
                      label="Files Changed"
                      textValue={data.restic.filesChanged.toLocaleString()}
                    />
                    <LabelAndValue
                      label="Files New"
                      textValue={data.restic.filesNew.toLocaleString()}
                    />
                    <LabelAndValue
                      label="Files Unmodified"
                      textValue={data.restic.filesUnmodified.toLocaleString()}
                    />
                    <LabelAndValue
                      label="Directories Changed"
                      textValue={data.restic.dirsChanged.toLocaleString()}
                    />
                    <LabelAndValue
                      label="Directories New"
                      textValue={data.restic.dirsNew.toLocaleString()}
                    />
                    <LabelAndValue
                      label="Directories Unmodified"
                      textValue={data.restic.dirsUnmodified.toLocaleString()}
                    />
                  </DetailsCardLayout>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Data Statistics</CardTitle>
                  <CardDescription>
                    Data size and backup performance metrics.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DetailsCardLayout>
                    <LabelAndValue
                      label="Total Bytes Processed"
                      textValue={formatSize(data.restic.totalBytesProcessed)}
                    />
                    <LabelAndValue
                      label="Data Added"
                      textValue={formatSize(data.restic.dataAdded)}
                    />
                    <LabelAndValue
                      label="Data Added (Packed)"
                      textValue={formatSize(data.restic.dataAddedPacked)}
                    />
                    <LabelAndValue
                      label="Data Blobs"
                      textValue={data.restic.dataBlobs.toLocaleString()}
                    />
                  </DetailsCardLayout>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Timing Information</CardTitle>
                  <CardDescription>
                    Backup duration and timing details.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DetailsCardLayout>
                    <LabelAndValue
                      label="Backup Duration"
                      textValue={formatDurationBetween(data.restic.backupStart, data.restic.backupEnd)}
                    />
                    <LabelAndValue
                      label="Backup Start"
                      textValue={new Date(data.restic.backupStart).toLocaleString()}
                    />
                    <LabelAndValue
                      label="Backup End"
                      textValue={new Date(data.restic.backupEnd).toLocaleString()}
                    />
                  </DetailsCardLayout>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      )}
    </BaseResourceDetailsPage>
  )
}
