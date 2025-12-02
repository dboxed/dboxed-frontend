import { SimpleSelectDialog } from "@/components/SimpleSelectDialog.tsx"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { useDboxedQueryClient } from "@/api/client.ts"
import { useDboxedMutation } from "@/api/mutation.ts"
import type { components } from "@/api/models/dboxed-schema"
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";

interface AttachVolumeDialogProps {
  boxId: string
  onSuccess: () => void
}

export function AttachVolumeDialog({ boxId, onSuccess }: AttachVolumeDialogProps) {
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useDboxedQueryClient()
  const [open, setOpen] = useState(false)

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
      trigger={
        <Button
          type={"button"}
          variant={"outline"}
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2"/>
          Attach Volume
        </Button>
      }
      onOpenChange={setOpen}
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
