import { Button } from "@/components/ui/button"
import { ConfirmationDialog } from "@/components/ConfirmationDialog"

interface DeleteButtonProps {
  onDelete: () => void
  resourceName: string
  disabled?: boolean
  isLoading?: boolean
  buttonText?: string
  className?: string
}

export function DeleteButton({
  onDelete,
  resourceName,
  disabled = false,
  isLoading = false,
  buttonText = "Delete",
  className
}: DeleteButtonProps) {
  const isDisabled = disabled || isLoading

  return (
    <ConfirmationDialog
      trigger={
        <Button
          variant="destructive"
          disabled={isDisabled}
          className={className}
        >
          {isLoading ? "Deleting..." : buttonText}
        </Button>
      }
      title="Are you sure?"
      description={`This action cannot be undone. This will permanently delete the ${resourceName}.`}
      confirmText="Delete"
      onConfirm={onDelete}
      destructive
    />
  )
} 