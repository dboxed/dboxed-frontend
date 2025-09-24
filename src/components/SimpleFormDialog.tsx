import type { ReactNode } from "react"
import { useEffect } from "react"
import { useForm, type UseFormReturn, type FieldValues, type DefaultValues } from "react-hook-form"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form.tsx";

interface SimpleFormDialogProps<T extends FieldValues = FieldValues> {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  children: (form: UseFormReturn<T>) => ReactNode
  buildInitial: () => DefaultValues<T>
  onSave: (formData: T) => void | Promise<void>
  onCancel?: () => void
  saveText?: string
  cancelText?: string
  saveDisabled?: boolean
  isLoading?: boolean
}

export function SimpleFormDialog<T extends FieldValues = FieldValues>({
  open,
  onOpenChange,
  title,
  children,
  buildInitial,
  onSave,
  onCancel,
  saveText = "Save",
  cancelText = "Cancel",
  saveDisabled = false,
  isLoading = false,
}: SimpleFormDialogProps<T>) {
  const form = useForm<T>({
    defaultValues: buildInitial(),
  })

  // Reset form data when dialog opens
  useEffect(() => {
    if (open) {
      form.reset(buildInitial())
    }
  }, [open, buildInitial, form])

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    }
    onOpenChange(false)
  }

  const handleSave = async () => {
    const formData = form.getValues()
    await onSave(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <div className="py-4">
            {children(form)}
          </div>
        </Form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={saveDisabled || isLoading}
          >
            {isLoading ? "Saving..." : saveText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}