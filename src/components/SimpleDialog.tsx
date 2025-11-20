import { type ReactNode } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface SimpleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  children: ReactNode
  onSave?: () => void | Promise<void>
  onCancel?: () => void
  saveText?: string
  cancelText?: string
  saveDisabled?: boolean
  isLoading?: boolean
  showCancel?: boolean
  showSave?: boolean
  wide?: boolean
}

export function SimpleDialog({
  open,
  onOpenChange,
  title,
  children,
  onSave,
  onCancel,
  saveText = "Save",
  cancelText = "Cancel",
  saveDisabled = false,
  isLoading = false,
  showCancel = true,
  showSave = true,
  wide = false,
}: SimpleDialogProps) {
  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    }
    onOpenChange(false)
  }

  const handleSave = async () => {
    if (onSave) {
      await onSave()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={wide ? "max-w-[95vw] min-w-[80vw] max-h-[90vh] min-h-[70vh] flex flex-col h-full" : "max-w-md"}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className={wide ? "flex-1 min-h-0" : "py-4"}>
          {children}
        </div>

        {(showCancel || showSave) && (
          <DialogFooter>
            {showCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                {cancelText}
              </Button>
            )}
            {showSave && (
              <Button
                type="button"
                onClick={handleSave}
                disabled={saveDisabled || isLoading}
              >
                {isLoading ? "Saving..." : saveText}
              </Button>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
