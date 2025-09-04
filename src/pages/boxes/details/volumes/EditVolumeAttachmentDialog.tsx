import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Label } from "@/components/ui/label.tsx"
import { Settings } from "lucide-react"
import { useDboxedQueryClient } from "@/api/api.ts"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import type { components } from "@/api/models/schema"

interface EditVolumeAttachmentDialogProps {
  boxId: number
  attachment: components["schemas"]["VolumeAttachment"]
  onSuccess?: () => void
}

export function EditVolumeAttachmentDialog({ boxId, attachment, onSuccess }: EditVolumeAttachmentDialogProps) {
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useDboxedQueryClient()
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    root_uid: attachment.root_uid.toString(),
    root_gid: attachment.root_gid.toString(),
    root_mode: attachment.root_mode
  })

  const updateAttachmentMutation = client.useMutation('patch', '/v1/workspaces/{workspaceId}/boxes/{id}/volumes/{volumeId}', {
    onSuccess: () => {
      setOpen(false)
      onSuccess?.()
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    updateAttachmentMutation.mutate({
      params: {
        path: {
          workspaceId: workspaceId!,
          id: boxId,
          volumeId: attachment.volume_id
        }
      },
      body: {
        root_uid: parseInt(formData.root_uid),
        root_gid: parseInt(formData.root_gid),
        root_mode: formData.root_mode
      }
    })
  }

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={updateAttachmentMutation.isPending}
        >
          <Settings className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Volume Attachment</DialogTitle>
          <DialogDescription>
            Modify the permissions and ownership settings for this volume attachment.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="root_uid">User ID (UID)</Label>
            <Input
              id="root_uid"
              type="number"
              min="0"
              value={formData.root_uid}
              onChange={(e) => handleInputChange('root_uid', e.target.value)}
              placeholder="0"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="root_gid">Group ID (GID)</Label>
            <Input
              id="root_gid"
              type="number"
              min="0"
              value={formData.root_gid}
              onChange={(e) => handleInputChange('root_gid', e.target.value)}
              placeholder="0"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="root_mode">File Mode</Label>
            <Input
              id="root_mode"
              value={formData.root_mode}
              onChange={(e) => handleInputChange('root_mode', e.target.value)}
              placeholder="0700"
              pattern="[0-7]{3,4}"
              title="Enter octal file permissions (e.g., 0755, 0644)"
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={updateAttachmentMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateAttachmentMutation.isPending}
            >
              {updateAttachmentMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}