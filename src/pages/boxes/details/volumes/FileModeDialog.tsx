import { type FormEvent, useCallback, useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Label } from "@/components/ui/label.tsx"
import { Settings } from "lucide-react"

interface FileModeDialogProps {
  uid: number
  gid: number
  mode: string
  onUpdate: (uid: number, gid: number, mode: string) => void
  onSuccess?: () => void
}

export function FileModeDialog({ uid, gid, mode, onUpdate, onSuccess }: FileModeDialogProps) {
  const buildInitialFormData = useCallback(() => {
    return {
      uid: uid.toString(),
      gid: gid.toString(),
      mode: mode
    }
  }, [uid, gid, mode])

  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState(buildInitialFormData())

  useEffect(() => {
    setFormData(buildInitialFormData())
  }, [buildInitialFormData]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onUpdate(parseInt(formData.uid), parseInt(formData.gid), formData.mode)
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
          type={"button"}
          variant="outline"
          size="sm"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit permissions and ownership</DialogTitle>
          <DialogDescription>
            Modify the permissions and ownership settings.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="uid">UID</Label>
            <Input
              id="uid"
              type="number"
              min="0"
              value={formData.uid}
              onChange={(e) => handleInputChange('uid', e.target.value)}
              placeholder="0"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="gid">GID</Label>
            <Input
              id="gid"
              type="number"
              min="0"
              value={formData.gid}
              onChange={(e) => handleInputChange('gid', e.target.value)}
              placeholder="0"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="mode">Access Mode</Label>
            <Input
              id="mode"
              value={formData.mode}
              onChange={(e) => handleInputChange('mode', e.target.value)}
              placeholder="0700"
              pattern="[0-7]{3,4}"
              title="Enter octal file permissions (e.g., 0755, 0644)"
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false)
              }}
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