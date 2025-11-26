import { type ReactNode, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area.tsx";

interface SimpleDialogProps {
  trigger?: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  title: string
  description?: string
  children: ReactNode
  onSave?: () => Promise<boolean>
  onCancel?: () => void
  saveText?: string
  cancelText?: string
  saveDisabled?: boolean
  showCancel?: boolean
  showSave?: boolean
  wide?: boolean
}

export function SimpleDialog({
  trigger,
  open,
  onOpenChange,
  title,
  description,
  children,
  onSave,
  onCancel,
  saveText = "Save",
  cancelText = "Cancel",
  saveDisabled = false,
  showCancel = true,
  showSave = true,
  wide = false,
}: SimpleDialogProps) {
  const [managedOpen, setManagedOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleOpenChange = (o: boolean) => {
    setManagedOpen(o)
    if (onOpenChange) {
      onOpenChange(o)
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    }
    handleOpenChange(false)
  }

  const handleSave = async () => {
    if (onSave) {
      setIsSaving(true)
      const close = await onSave()
      setIsSaving(false)
      if (close) {
        handleOpenChange(false)
      }
    }
  }

  const realOpen = open !== undefined ? open : managedOpen

  const widthClass = wide ? "sm:max-w-[95vw] w-[80vw]" : "sm:max-w-lg"

  return <Dialog open={realOpen} onOpenChange={handleOpenChange}>
    <DialogTrigger asChild>
      {trigger}
    </DialogTrigger>
    <DialogContent className={`p-0 ${widthClass} max-h-[90vh] flex flex-col`}>
      <DialogHeader className="border-b px-6 pt-6 pb-4 flex-shrink-0">
        <DialogTitle>{title}</DialogTitle>
        {description && <DialogDescription>
          {description}
        </DialogDescription>}
      </DialogHeader>
      <ScrollArea className="overflow-y-auto flex-shrink">
        <div className="px-6 py-4">
          {children}
        </div>
      </ScrollArea>
      <DialogFooter className="px-6 pt-4 pb-6 border-t flex-shrink-0">
        {showCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSaving}
          >
            {cancelText}
          </Button>
        )}
        {showSave && (
          <Button
            type="button"
            onClick={handleSave}
            disabled={saveDisabled || isSaving}
          >
            {isSaving ? "Saving..." : saveText}
          </Button>
        )}
      </DialogFooter>
    </DialogContent>
  </Dialog>
}
