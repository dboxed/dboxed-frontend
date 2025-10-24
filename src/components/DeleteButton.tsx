import { Button } from "@/components/ui/button"
import { ConfirmationDialog } from "@/components/ConfirmationDialog"
import { Trash2 } from "lucide-react"

interface DeleteButtonProps {
  onDelete: () => void
  resourceName?: string
  disabled?: boolean
  isLoading?: boolean
  buttonText?: string
  className?: string
  confirmationTitle?: string
  confirmationDescription?: string
  size?: "default" | "sm" | "lg" | "icon"
  variant?: "destructive" | "ghost" | "outline"
  children?: React.ReactNode
}

export function DeleteButton({
  onDelete,
  resourceName,
  disabled = false,
  isLoading = false,
  buttonText = "Delete",
  className,
  confirmationTitle,
  confirmationDescription,
  size = "default",
  variant = "destructive",
  children
}: DeleteButtonProps) {
  const isDisabled = disabled || isLoading

  // Use custom confirmation text or fall back to defaults
  const title = confirmationTitle || "Are you sure?"
  const description = confirmationDescription || 
    (resourceName ? `This action cannot be undone. This will permanently delete the ${resourceName}.` : "This action cannot be undone.")

  return (
    <ConfirmationDialog
      trigger={
        <Button
          variant={variant}
          disabled={isDisabled}
          className={className}
          size={size}
        >
          {isLoading ? "Deleting..." : (buttonText || <Trash2 className="h-4 w-4" />)}
        </Button>
      }
      title={title}
      description={description}
      confirmText="Delete"
      onConfirm={onDelete}
      destructive
    >
      {children}
    </ConfirmationDialog>
  )
} 