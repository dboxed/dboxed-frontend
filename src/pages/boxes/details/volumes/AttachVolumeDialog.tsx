import { SimpleSelectDialog } from "@/components/SimpleSelectDialog.tsx"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { useDboxedQueryClient } from "@/api/client.ts"
import { useDboxedMutation } from "@/api/mutation.ts"
import type { components } from "@/api/models/dboxed-schema"

interface AttachVolumeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  boxId: string
  onSuccess: () => void
}

export function AttachVolumeDialog({ open, onOpenChange, boxId, onSuccess }: AttachVolumeDialogProps) {
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

  const attachVolumeMutation = useDboxedMutation('post', '/v1/workspaces/{workspaceId}/boxes/{id}/volumes', {
    successMessage: "Volume attached successfully!",
    errorMessage: "Failed to attach volume",
    refetchPath: "/v1/workspaces/{workspaceId}/boxes/{id}/volumes",
    onSuccess: () => onSuccess(),
  })

  const handleAttachVolume = async (selectedVolume: components["schemas"]["Volume"]) => {
    return await attachVolumeMutation.mutateAsync({
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
