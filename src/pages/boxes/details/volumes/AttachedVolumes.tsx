import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Button } from "@/components/ui/button.tsx"
import { ReferenceLabel } from "@/components/ReferenceLabel.tsx"
import { DataTable } from "@/components/data-table.tsx"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { useDboxedQueryClient } from "@/api/api.ts"
import type { components } from "@/api/models/schema"
import type { ColumnDef } from "@tanstack/react-table"
import { Plus, Unplug } from "lucide-react"
import { ConfirmationDialog } from "@/components/ConfirmationDialog.tsx"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip.tsx"
import { formatSize } from "@/utils/size.ts"
import { FileModeDialog } from "@/pages/boxes/details/volumes/FileModeDialog.tsx"
import { VolumeMountBadge } from "@/pages/volumes/details/VolumeMountBadge.tsx"
import { AttachVolumeDialog } from "@/pages/boxes/details/volumes/AttachVolumeDialog.tsx"
import { toast } from "sonner"

interface AttachedVolumesProps {
  box: components["schemas"]["Box"]
}

export function AttachedVolumes({ box }: AttachedVolumesProps) {
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useDboxedQueryClient()
  const [attachDialogOpen, setAttachDialogOpen] = useState(false)

  const attachedVolumesQuery = client.useQuery('get', '/v1/workspaces/{workspaceId}/boxes/{id}/volumes', {
    params: {
      path: {
        workspaceId: workspaceId!,
        id: box.id
      }
    }
  },{
    refetchInterval: 5000,
  })

  const detachVolumeMutation = client.useMutation('delete', '/v1/workspaces/{workspaceId}/boxes/{id}/volumes/{volumeId}', {
    onSuccess: () => {
      attachedVolumesQuery.refetch()
    }
  })

  const updateAttachmentMutation = client.useMutation('patch', '/v1/workspaces/{workspaceId}/boxes/{id}/volumes/{volumeId}', {
    onSuccess: () => {
      attachedVolumesQuery.refetch()
    }
  })

  const handleDetachVolume = (volumeId: string) => {
    detachVolumeMutation.mutate({
      params: {
        path: {
          workspaceId: workspaceId!,
          id: box.id,
          volumeId: volumeId
        }
      }
    },  {
      onSuccess: () => {
        toast.success("Volume deattached successfully!")
      },
      onError: (error) => {
        toast.error("Failed to detach volume", {
          description: error.detail || "An error occurred while detaching the volume."
        })
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

        return <VolumeMountBadge mountStatus={volume.mountStatus} />
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
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const attachment = row.original
        const volume = attachment.volume!
        return (
          <div className="flex space-x-2">
            <Tooltip>
              <TooltipTrigger>
                <div>
                  <FileModeDialog
                    uid={attachment.rootUid}
                    gid={attachment.rootGid}
                    mode={attachment.rootMode}
                    onUpdate={(uid, gid, mode) => {
                      updateAttachmentMutation.mutate({
                        params: {
                          path: {
                            workspaceId: workspaceId!,
                            id: box.id,
                            volumeId: attachment.volumeId
                          }
                        },
                        body: {
                          rootUid: uid,
                          rootGid: gid,
                          rootMode: mode
                        }
                      })
                    }}
                    onSuccess={() => attachedVolumesQuery.refetch()}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit permissions</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <ConfirmationDialog
                    trigger={
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={detachVolumeMutation.isPending}
                      >
                        <Unplug className="w-4 h-4" />
                      </Button>
                    }
                    title="Detach Volume"
                    description={`Are you sure you want to detach volume "${volume.name}"?`}
                    confirmText="Detach"
                    onConfirm={() => handleDetachVolume(attachment.volumeId)}
                    destructive
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Detach volume</p>
              </TooltipContent>
            </Tooltip>
          </div>
        )
      }
    }
  ]

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
            <Button
              type={"button"}
              variant={"outline"}
              onClick={() => {
                setAttachDialogOpen(true)
              }}
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Attach Volume
            </Button>
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
        boxId={box.id}
        open={attachDialogOpen}
        onOpenChange={setAttachDialogOpen}
        onSuccess={() => {
          attachedVolumesQuery.refetch()
        }}
      />
    </>
  )
}