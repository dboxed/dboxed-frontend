import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Badge } from "@/components/ui/badge.tsx"
import { ReferenceLabel } from "@/components/ReferenceLabel.tsx"
import { SimpleSelectDialog } from "@/components/SimpleSelectDialog.tsx"
import { DataTable } from "@/components/data-table.tsx"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { useDboxedQueryClient } from "@/api/api.ts"
import type { components } from "@/api/models/schema"
import type { ColumnDef } from "@tanstack/react-table"
import { Plus, Unplug } from "lucide-react"
import { ConfirmationDialog } from "@/components/ConfirmationDialog.tsx"
import { EditVolumeAttachmentDialog } from "./EditVolumeAttachmentDialog.tsx"
import { formatSize } from "@/utils/size.ts"

interface AttachedVolumesProps {
  boxId: number
}

export function AttachedVolumes({ boxId }: AttachedVolumesProps) {
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useDboxedQueryClient()
  const [attachDialogOpen, setAttachDialogOpen] = useState(false)

  const attachedVolumesQuery = client.useQuery('get', '/v1/workspaces/{workspaceId}/boxes/{id}/volumes', {
    params: {
      path: {
        workspaceId: workspaceId!,
        id: boxId
      }
    }
  })

  const allVolumesQuery = client.useQuery('get', '/v1/workspaces/{workspaceId}/volumes', {
    params: {
      path: {
        workspaceId: workspaceId!
      }
    }
  })

  const attachVolumeMutation = client.useMutation('post', '/v1/workspaces/{workspaceId}/boxes/{id}/volumes', {
    onSuccess: () => {
      attachedVolumesQuery.refetch()
    }
  })

  const detachVolumeMutation = client.useMutation('delete', '/v1/workspaces/{workspaceId}/boxes/{id}/volumes/{volumeId}', {
    onSuccess: () => {
      attachedVolumesQuery.refetch()
    }
  })

  const handleAttachVolume = (selectedVolume: components["schemas"]["Volume"]) => {
    attachVolumeMutation.mutate({
      params: {
        path: {
          workspaceId: workspaceId!,
          id: boxId
        }
      },
      body: {
        volume_id: selectedVolume.id,
        root_uid: 0,
        root_gid: 0,
        root_mode: "0700"
      }
    })
  }

  const handleDetachVolume = (volumeId: number) => {
    detachVolumeMutation.mutate({
      params: {
        path: {
          workspaceId: workspaceId!,
          id: boxId,
          volumeId: volumeId
        }
      }
    })
  }

  const attachedVolumeAttachments = attachedVolumesQuery.data?.items || []
  const allVolumes = allVolumesQuery.data?.items || []
  const attachedVolumeIds = new Set(attachedVolumeAttachments.map(va => va.volume_id))
  const availableVolumes = allVolumes.filter(v => !attachedVolumeIds.has(v.id))

  // Define columns for the DataTable
  const columns: ColumnDef<components["schemas"]["VolumeAttachment"]>[] = [
    {
      accessorKey: "volume.name",
      header: "Volume Name",
      cell: ({ row }) => {
        const attachment = row.original
        const volume = attachment.volume
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
      accessorKey: "volume.volume_provider_type",
      header: "Provider Type",
      cell: ({ row }) => {
        const attachment = row.original
        const volume = attachment.volume
        
        return (
          <Badge variant="secondary" className="capitalize">
            {volume.volume_provider_type}
          </Badge>
        )
      }
    },
    {
      accessorKey: "volume.dboxed.fs_size",
      header: "Size",
      cell: ({ row }) => {
        const attachment = row.original
        const volume = attachment.volume
        
        switch (volume.volume_provider_type) {
          case "dboxed":
            return formatSize(volume.dboxed.fs_size)
          
          default:
            return "N/A"
        }
      }
    },
    {
      accessorKey: "root_uid",
      header: "UID",
      cell: ({ row }) => {
        return row.original.root_uid
      }
    },
    {
      accessorKey: "root_gid", 
      header: "GID",
      cell: ({ row }) => {
        return row.original.root_gid
      }
    },
    {
      accessorKey: "root_mode",
      header: "Mode",
      cell: ({ row }) => {
        return (
          <code className="text-sm bg-muted px-1 py-0.5 rounded">
            {row.original.root_mode}
          </code>
        )
      }
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const attachment = row.original
        const volume = attachment.volume
        return (
          <div className="flex space-x-2">
            <EditVolumeAttachmentDialog
              boxId={boxId}
              attachment={attachment}
              onSuccess={() => attachedVolumesQuery.refetch()}
            />
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
              onConfirm={() => handleDetachVolume(attachment.volume_id)}
              destructive
            />
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
              variant={"outline"}
              onClick={(e) => {
                setAttachDialogOpen(true)
                e.preventDefault()
              }}
              disabled={availableVolumes.length === 0}
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

      <SimpleSelectDialog<components["schemas"]["Volume"]>
        open={attachDialogOpen}
        onOpenChange={setAttachDialogOpen}
        title="Attach Volume"
        fieldLabel="Select Volume"
        placeholder="Choose a volume to attach..."
        options={availableVolumes}
        optionKey="id"
        optionLabel="name"
        onOk={handleAttachVolume}
      />
    </>
  )
}