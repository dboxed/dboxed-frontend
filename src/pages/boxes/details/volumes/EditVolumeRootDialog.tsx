import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Label } from "@/components/ui/label.tsx"
import { Settings } from "lucide-react"
import type { components } from "@/api/models/schema"

interface EditVolumeRootDialogProps {
  volume: components["schemas"]["BoxVolumeSpec"]
  onUpdate: (updatedVolume: components["schemas"]["BoxVolumeSpec"]) => void
  onSuccess?: () => void
}

export function EditVolumeRootDialog({ volume, onUpdate, onSuccess }: EditVolumeRootDialogProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    root_uid: volume.rootUid.toString(),
    root_gid: volume.rootGid.toString(),
    root_mode: volume.rootMode
  })

  const handleSubmit = () => {
    const updatedVolume: components["schemas"]["BoxVolumeSpec"] = {
      ...volume,
      rootUid: parseInt(formData.root_uid),
      rootGid: parseInt(formData.root_gid),
      rootMode: formData.root_mode
    }
    
    onUpdate(updatedVolume)
    setOpen(false)
    onSuccess?.()
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
        >
          <Settings className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Volume</DialogTitle>
          <DialogDescription>
            Modify the permissions and ownership settings for this volume.
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
            >
              Cancel
            </Button>
            <Button
              type="submit"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}