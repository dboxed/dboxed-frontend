import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Card, CardContent } from "@/components/ui/card.tsx"
import type { components } from "@/api/models/schema"
import { FileBundleEntryTable } from "@/pages/boxes/details";

type FileBundle = components["schemas"]["FileBundle"]
type FileBundleEntry = components["schemas"]["FileBundleEntry"]

interface FileBundleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  bundle: FileBundle
  onSave: (bundle: FileBundle) => void
}

export function FileBundleDialog({
                                   open,
                                   onOpenChange,
                                   bundle,
                                   onSave,
                                 }: FileBundleDialogProps) {
  const [editedBundle, setEditedBundle] = useState(bundle)

  useEffect(() => {
    setEditedBundle(JSON.parse(JSON.stringify(bundle)))
  }, [bundle]);

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen)
  }

  const handleSaveFiles = (data: FileBundleEntry[]) => {
    setEditedBundle({
      ...editedBundle,
      files: data,
    })
  }

  const handleCancel = () => {
    onOpenChange(false)
  }
  const handleOk = () => {
    onSave(editedBundle)
    onOpenChange(false)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-6xl max-h-[80vh] min-w-3xl min-h-[60vh] flex flex-col">

          <DialogHeader>
            <DialogTitle>Edit File Bundle</DialogTitle>
          </DialogHeader>

          <Card>
            <CardContent>
              <FileBundleEntryTable entries={editedBundle.files || []} onUpdate={handleSaveFiles}/>
            </CardContent>
          </Card>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="button" onClick={handleOk}>
              Ok
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 