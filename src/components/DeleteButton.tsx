import { Button } from "@/components/ui/button"
import { ConfirmationDialog } from "@/components/ConfirmationDialog"

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
  size = "default"
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
          variant="destructive"
          disabled={isDisabled}
          className={className}
          size={size}
        >
          {isLoading ? "Deleting..." : buttonText}
        </Button>
      }
      title={title}
      description={description}
      confirmText="Delete"
      onConfirm={onDelete}
      destructive
    />
  )
} 