import { type ReactNode, useCallback, useEffect, useState } from "react"
import { useForm, type UseFormReturn, type FieldValues, type DefaultValues } from "react-hook-form"
import { Form } from "@/components/ui/form.tsx";
import { deepClone } from "@/utils/utils.ts";
import { SimpleDialog } from "@/components/SimpleDialog";

interface SimpleFormDialogProps<T extends FieldValues = FieldValues> {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: (form: UseFormReturn<T>) => ReactNode
  buildInitial: () => DefaultValues<T> | undefined
  onSave: (formData: T) => Promise<boolean>
  onCancel?: () => void
  saveText?: string
  cancelText?: string
  saveDisabled?: boolean
  showCancel?: boolean
  wide?: boolean
}

export function SimpleFormDialog<T extends FieldValues = FieldValues>({
  open,
  onOpenChange,
  title,
  description,
  children,
  buildInitial,
  onSave,
  onCancel,
  saveText = "Save",
  cancelText = "Cancel",
  saveDisabled = false,
  showCancel = true,
  wide = false,
}: SimpleFormDialogProps<T>) {
  const [oldOpen, setOldOpen] = useState(false)

  const doBuildInitial = useCallback(() => {
    const data = buildInitial()
    if (data === undefined) {
      return undefined
    }
    return deepClone(data)
  }, [buildInitial])

  const form = useForm<T>({})

  useEffect(() => {
    if (open && !oldOpen) {
      // Reset form data when dialog opens
      form.reset(doBuildInitial())
    }
    setOldOpen(open)
  }, [open, oldOpen, doBuildInitial, form]);

  const handleSave = async () => {
    const formData = form.getValues()
    return await onSave(formData)
  }

  return (
    <SimpleDialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      onSave={handleSave}
      onCancel={onCancel}
      saveText={saveText}
      cancelText={cancelText}
      saveDisabled={saveDisabled}
      showCancel={showCancel}
      wide={wide}
    >
      <Form {...form}>
        {children(form)}
      </Form>
    </SimpleDialog>
  )
}