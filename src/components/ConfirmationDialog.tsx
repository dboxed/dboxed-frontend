import { type ReactNode, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface ConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => Promise<boolean>
  destructive?: boolean
  children?: ReactNode
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  destructive = false,
  children
}: ConfirmationDialogProps) {
  const [isConfirming, setIsConfirming] = useState(false)

  const setOpen = (newOpen: boolean) => {
    if (!newOpen && isConfirming) return
    onOpenChange(newOpen)
  }

  const handleConfirm = async () => {
    setIsConfirming(true)
    const close = await onConfirm()
    if (close) {
      setOpen(false)
    }
    setIsConfirming(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        onPointerDownOutside={(e) => isConfirming && e.preventDefault()}
        onEscapeKeyDown={(e) => isConfirming && e.preventDefault()}
        onInteractOutside={(e) => isConfirming && e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isConfirming}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant={destructive ? "destructive" : "default"}
            onClick={handleConfirm}
            disabled={isConfirming}
          >
            {isConfirming ? "..." : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
