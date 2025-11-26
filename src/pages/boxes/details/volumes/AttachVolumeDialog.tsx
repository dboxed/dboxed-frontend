import { SimpleSelectDialog } from "@/components/SimpleSelectDialog.tsx"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { useDboxedQueryClient } from "@/api/dboxed-api.ts"
import type { components } from "@/api/models/dboxed-schema"
import { toast } from "sonner"
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

  const attachVolumeMutation = client.useMutation('post', '/v1/workspaces/{workspaceId}/boxes/{id}/volumes', {
    onSuccess: () => {
      allVolumesQuery.refetch()
      onSuccess()
    }
  })

  const handleAttachVolume = (selectedVolume: components["schemas"]["Volume"]) => {
    return new Promise<boolean>(resolve => {
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
          resolve(true)
        },
        onError: (error) => {
          toast.error("Failed to attach volume", {
            description: error.detail || "An error occurred while attaching the volume."
          })
          resolve(false)
        }
      })
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
