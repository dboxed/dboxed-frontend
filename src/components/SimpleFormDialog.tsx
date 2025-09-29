import { type ReactNode, useCallback, useState } from "react"
import { useEffect } from "react"
import { useForm, type UseFormReturn, type FieldValues, type DefaultValues } from "react-hook-form"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form.tsx";
import { deepClone } from "@/utils/clone.ts";

interface SimpleFormDialogProps<T extends FieldValues = FieldValues> {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  children: (form: UseFormReturn<T>) => ReactNode
  buildInitial: () => DefaultValues<T> | undefined
  onSave: (formData: T) => Promise<boolean>
  onCancel?: () => void
  saveText?: string
  cancelText?: string
  saveDisabled?: boolean
  isLoading?: boolean
  showCancel?: boolean
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
  showCancel = true,
}: SimpleFormDialogProps<T>) {
  const [oldOpen, setOldOpen] = useState(open)

  const doBuildInitial = useCallback(() => {
    const data = buildInitial()
    if (data === undefined) {
      return undefined
    }
    return deepClone(data)
  }, [buildInitial])

  const form = useForm<T>({
    defaultValues: doBuildInitial(),
  })

  // Reset form data when dialog opens
  useEffect(() => {
    if (open && !oldOpen) {
      form.reset(doBuildInitial())
    }
    setOldOpen(open)
  }, [doBuildInitial, form, open, oldOpen])

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    }
    onOpenChange(false)
  }

  const handleSave = async () => {
    const formData = form.getValues()
    const ret = await onSave(formData)
    if (ret) {
      onOpenChange(false)
    }
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