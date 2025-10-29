import { BaseResourceDetailsPage } from "@/pages/base/BaseResourceDetailsPage.tsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { useParams } from "react-router"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { LabelAndValue } from "@/components/LabelAndValue.tsx"
import { DetailsCardLayout } from "@/components/DetailsCardLayout.tsx"
import { formatDuration } from "@/utils/time.ts"
import { TimeAgo } from "@/components/TimeAgo.tsx"
import { formatSize } from "@/utils/size.ts"
import type { components } from "@/api/models/schema"

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
                  label="Lock ID"
                  textValue={data.lockId}
                />
              </DetailsCardLayout>
            </CardContent>
          </Card>

          {data.rustic && (
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
                      label="Snapshot ID (Rustic)"
                      textValue={data.rustic.snapshotId}
                    />
                    <LabelAndValue
                      label="Hostname"
                      textValue={data.rustic.hostname}
                    />
                    <LabelAndValue
                      label="Parent Snapshot"
                      textValue={data.rustic.parentSnapshotId || "None"}
                    />
                    <LabelAndValue
                      label="Snapshot Time"
                      value={<TimeAgo date={data.rustic.snapshotTime} />}
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
                      textValue={data.rustic.totalFilesProcessed.toLocaleString()}
                    />
                    <LabelAndValue
                      label="Files Changed"
                      textValue={data.rustic.filesChanged.toLocaleString()}
                    />
                    <LabelAndValue
                      label="Files New"
                      textValue={data.rustic.filesNew.toLocaleString()}
                    />
                    <LabelAndValue
                      label="Files Unmodified"
                      textValue={data.rustic.filesUnmodified.toLocaleString()}
                    />
                    <LabelAndValue
                      label="Total Directories Processed"
                      textValue={data.rustic.totalDirsProcessed.toLocaleString()}
                    />
                    <LabelAndValue
                      label="Directories Changed"
                      textValue={data.rustic.dirsChanged.toLocaleString()}
                    />
                    <LabelAndValue
                      label="Directories New"
                      textValue={data.rustic.dirsNew.toLocaleString()}
                    />
                    <LabelAndValue
                      label="Directories Unmodified"
                      textValue={data.rustic.dirsUnmodified.toLocaleString()}
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
                      textValue={formatSize(data.rustic.totalBytesProcessed)}
                    />
                    <LabelAndValue
                      label="Data Added"
                      textValue={formatSize(data.rustic.dataAdded)}
                    />
                    <LabelAndValue
                      label="Data Added (Packed)"
                      textValue={formatSize(data.rustic.dataAddedPacked)}
                    />
                    <LabelAndValue
                      label="Data Added Files"
                      textValue={data.rustic.dataAddedFiles.toLocaleString()}
                    />
                    <LabelAndValue
                      label="Data Added Files (Packed)"
                      textValue={data.rustic.dataAddedFilesPacked.toLocaleString()}
                    />
                    <LabelAndValue
                      label="Data Blobs"
                      textValue={data.rustic.dataBlobs.toLocaleString()}
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
                      textValue={formatDuration(data.rustic.backupDuration)}
                    />
                    <LabelAndValue
                      label="Total Duration"
                      textValue={formatDuration(data.rustic.totalDuration)}
                    />
                    <LabelAndValue
                      label="Backup Start"
                      textValue={new Date(data.rustic.backupStart).toLocaleString()}
                    />
                    <LabelAndValue
                      label="Backup End"
                      textValue={new Date(data.rustic.backupEnd).toLocaleString()}
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
