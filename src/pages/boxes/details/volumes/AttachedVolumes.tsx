import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Button } from "@/components/ui/button.tsx"
import { ReferenceLabel } from "@/components/ReferenceLabel.tsx"
import { DataTable } from "@/components/data-table.tsx"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { useDboxedQueryClient } from "@/api/client.ts"
import { useDboxedMutation } from "@/api/mutation.ts"
import { useEditDialogOpenState } from "@/hooks/use-edit-dialog-open-state.ts"
import type { components } from "@/api/models/dboxed-schema"
import type { ColumnDef } from "@tanstack/react-table"
import { Plus, Settings, Unplug } from "lucide-react"
import { ConfirmationDialog } from "@/components/ConfirmationDialog.tsx"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip.tsx"
import { formatSize } from "@/utils/size.ts"
import { FileModeDialog } from "@/pages/boxes/details/volumes/FileModeDialog.tsx"
import { VolumeMountBadge } from "@/pages/volumes/details/VolumeMountBadge.tsx"
import { AttachVolumeDialog } from "@/pages/boxes/details/volumes/AttachVolumeDialog.tsx"

interface AttachedVolumesProps {
  box: components["schemas"]["Box"]
}

export function AttachedVolumes({ box }: AttachedVolumesProps) {
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useDboxedQueryClient()
  const attachDialog = useEditDialogOpenState()
  const editDialog = useEditDialogOpenState<components["schemas"]["VolumeAttachment"]>()
  const detachDialog = useEditDialogOpenState<components["schemas"]["VolumeAttachment"]>()

  const allowEditing = box.boxType === "normal"

  const attachedVolumesQuery = client.useQuery('get', '/v1/workspaces/{workspaceId}/boxes/{id}/volumes', {
    params: {
      path: {
        workspaceId: workspaceId!,
        id: box.id
      }
    }
  }, {
    refetchInterval: 5000,
  })

  const detachVolumeMutation = useDboxedMutation('delete', '/v1/workspaces/{workspaceId}/boxes/{id}/volumes/{volumeId}', {
    successMessage: "Volume detached successfully!",
    errorMessage: "Failed to detach volume",
    refetchPath: "/v1/workspaces/{workspaceId}/boxes/{id}/volumes",
  })

  const updateAttachmentMutation = useDboxedMutation('patch', '/v1/workspaces/{workspaceId}/boxes/{id}/volumes/{volumeId}', {
    successMessage: "Attachment updated successfully!",
    errorMessage: "Failed to update attachment",
    refetchPath: "/v1/workspaces/{workspaceId}/boxes/{id}/volumes",
  })

  const handleDetachVolume = async (volumeId: string) => {
    return await detachVolumeMutation.mutateAsync({
      params: {
        path: {
          workspaceId: workspaceId!,
          id: box.id,
          volumeId: volumeId
        }
      }
    })
  }

  const attachedVolumeAttachments = attachedVolumesQuery.data?.items || []

  // Define columns for the DataTable
  const columns: ColumnDef<components["schemas"]["VolumeAttachment"]>[] = [
    {
      accessorKey: "volume.name",
      header: "Volume Name",
      cell: ({ row }) => {
        const attachment = row.original
        const volume = attachment.volume!
        return (
          <ReferenceLabel
            resourceId={volume.id}
            resourcePath="/v1/workspaces/{workspaceId}/volumes/{id}"
            pathParams={{
              workspaceId: workspaceId!,
              id: volume.id
            }}
            detailsUrl={`/workspaces/${workspaceId}/volumes/${volume.id}`}
            fallbackLabel={volume.name}
            className="text-blue-600 hover:text-blue-800 underline"
          />
        )
      }
    },
    {
      accessorKey: "volume.mountStatus",
      header: "Mount Status",
      cell: ({ row }) => {
        const attachment = row.original
        const volume = attachment.volume!

        return <VolumeMountBadge mountStatus={volume.mountStatus}/>
      }
    },
    {
      accessorKey: "volume.rustic.fsSize",
      header: "Size",
      cell: ({ row }) => {
        const attachment = row.original
        const volume = attachment.volume!

        switch (volume.volumeProviderType) {
          case "rustic":
            return formatSize(volume.rustic!.fsSize)

          default:
            return "N/A"
        }
      }
    },
    {
      accessorKey: "rootUid",
      header: "UID",
      cell: ({ row }) => {
        return row.original.rootUid
      }
    },
    {
      accessorKey: "rootGid",
      header: "GID",
      cell: ({ row }) => {
        return row.original.rootGid
      }
    },
    {
      accessorKey: "rootMode",
      header: "Mode",
      cell: ({ row }) => {
        return (
          <code className="text-sm bg-muted px-1 py-0.5 rounded">
            {row.original.rootMode}
          </code>
        )
      }
    },
  ]
  if (allowEditing) {
    columns.push({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
          return (
            <div className="flex space-x-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => editDialog.setItem(row.original)}
                  >
                    <Settings className="w-4 h-4"/>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit permissions</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => detachDialog.setItem(row.original)}
                  >
                    <Unplug className="w-4 h-4"/>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Detach volume</p>
                </TooltipContent>
              </Tooltip>
            </div>
          )
        }
    })
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Attached Volumes</CardTitle>
              <CardDescription>
                Volumes currently attached to this box
              </CardDescription>
            </div>
            {allowEditing && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => attachDialog.setOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2"/>
                Attach Volume
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={attachedVolumeAttachments}
            searchColumn="volume.name"
            searchPlaceholder="Search volumes..."
          />
        </CardContent>
      </Card>
      <AttachVolumeDialog
        {...attachDialog.dialogProps}
        boxId={box.id}
        onSuccess={() => attachedVolumesQuery.refetch()}
      />
      {editDialog.item && <FileModeDialog
        uid={editDialog.item.rootUid}
        gid={editDialog.item.rootGid}
        mode={editDialog.item.rootMode}
        {...editDialog.dialogProps}
        onUpdate={async (uid, gid, mode) => {
          return await updateAttachmentMutation.mutateAsync({
            params: {
              path: {
                workspaceId: workspaceId!,
                id: box.id,
                volumeId: editDialog.item!.volumeId
              }
            },
            body: {
              rootUid: uid,
              rootGid: gid,
              rootMode: mode
            }
          })
        }}
      />}
      {detachDialog.item && <ConfirmationDialog
        {...detachDialog.dialogProps}
        title="Detach Volume"
        description={`Are you sure you want to detach volume "${detachDialog.item.volume?.name}"?`}
        confirmText="Detach"
        onConfirm={() => handleDetachVolume(detachDialog.item!.volumeId)}
        destructive
      />}
    </>
  )
}