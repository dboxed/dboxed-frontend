import { type ReactNode, useCallback, useState } from "react"
import { useEffect } from "react"
import { useForm, type UseFormReturn, type FieldValues, type DefaultValues } from "react-hook-form"
import { Form } from "@/components/ui/form.tsx";
import { deepClone } from "@/utils/utils.ts";
import { SimpleDialog } from "@/components/SimpleDialog";

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
  wide?: boolean
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
  wide = false,
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

  const handleSave = async () => {
    const formData = form.getValues()
    const ret = await onSave(formData)
    if (ret) {
      onOpenChange(false)
    }
  }

  return (
    <SimpleDialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      onSave={handleSave}
      onCancel={onCancel}
      saveText={saveText}
      cancelText={cancelText}
      saveDisabled={saveDisabled}
      isLoading={isLoading}
      showCancel={showCancel}
      wide={wide}
    >
      <Form {...form}>
        {children(form)}
      </Form>
    </SimpleDialog>
  )
}