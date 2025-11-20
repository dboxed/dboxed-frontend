import { SimpleSelectDialog } from "@/components/SimpleSelectDialog.tsx"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { useDboxedQueryClient } from "@/api/dboxed-api.ts"
import type { components } from "@/api/models/dboxed-schema"
import { toast } from "sonner"

interface AttachVolumeDialogProps {
  boxId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function AttachVolumeDialog({ boxId, open, onOpenChange, onSuccess }: AttachVolumeDialogProps) {
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useDboxedQueryClient()

  const allVolumesQuery = client.useQuery('get', '/v1/workspaces/{workspaceId}/volumes', {
    params: {
      path: {
        workspaceId: workspaceId!
      }
    },
  }, {
    enabled: open,
  })

  const attachVolumeMutation = client.useMutation('post', '/v1/workspaces/{workspaceId}/boxes/{id}/volumes', {
    onSuccess: () => {
      allVolumesQuery.refetch()
      onSuccess()
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
        volumeId: selectedVolume.id,
        rootUid: 0,
        rootGid: 0,
        rootMode: "0777"
      }
    }, {
      onSuccess: () => {
        toast.success("Volume attached successfully!")
      },
      onError: (error) => {
        toast.error("Failed to attach volume", {
          description: error.detail || "An error occurred while attaching the volume."
        })
      }
    })
  }

  const availableVolumes = allVolumesQuery.data?.items?.filter(v => !v.attachment) || []

  return (
    <SimpleSelectDialog<components["schemas"]["Volume"]>
      open={open}
      onOpenChange={onOpenChange}
      title="Attach Volume"
      fieldLabel="Select Volume"
      placeholder="Choose a volume to attach..."
      options={availableVolumes}
      optionKey="id"
      optionLabel="name"
      onOk={handleAttachVolume}
    />
  )
}
