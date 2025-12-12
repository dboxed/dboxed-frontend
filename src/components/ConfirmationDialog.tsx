import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { type MouseEvent, useState } from "react";
import { Button } from "@/components/ui/button.tsx";

interface ConfirmationDialogProps {
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => Promise<boolean>
  destructive?: boolean
  children?: React.ReactNode
}

export function ConfirmationDialog({
  trigger,
  open: controlledOpen,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  destructive = false,
  children
}: ConfirmationDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen

  const setOpen = (newOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(newOpen)
    }
    onOpenChange?.(newOpen)
  }
  const [isConfirming, setIsConfirming] = useState(false)

  const handleConfirm = async (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsConfirming(true)
    const close = await onConfirm()
    if (close) {
      setOpen(false)
    }
    setIsConfirming(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {trigger && <AlertDialogTrigger asChild>
        {trigger}
      </AlertDialogTrigger>}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {children}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isConfirming}>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            asChild
            className={destructive ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""}
          >
            <Button type={"button"} disabled={isConfirming} onClick={handleConfirm}>{confirmText}</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}