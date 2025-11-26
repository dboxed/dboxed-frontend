import { SimpleFormDialog } from "@/components/SimpleFormDialog"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import type { ReactNode } from "react";

interface SimpleInputFormData {
  value: string
}

interface SimpleInputDialogProps {
  trigger: ReactNode
  onOpenChange?: (open: boolean) => void
  title: string
  description?: string
  fieldLabel: string
  placeholder?: string
  defaultValue?: string
  onSave: (value: string) => (Promise<boolean> | boolean)
  autoCapitalize?: string
}

export function SimpleInputDialog({
  trigger,
  onOpenChange,
  title,
  description,
  fieldLabel,
  placeholder,
  defaultValue = "",
  onSave,
  autoCapitalize
}: SimpleInputDialogProps) {
  const buildInitial = (): SimpleInputFormData => ({
    value: defaultValue,
  })

  const handleSave = async (data: SimpleInputFormData) => {
    const trimmedValue = data.value.trim()
    if (trimmedValue) {
      return onSave(trimmedValue)
    }
    return false
  }

  return (
    <SimpleFormDialog<SimpleInputFormData>
      trigger={trigger}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      buildInitial={buildInitial}
      onSave={handleSave}
      saveText="OK"
      saveDisabled={false}
    >
      {(form) => (
        <FormField
          control={form.control}
          name="value"
          rules={{
            required: "This field is required",
            validate: (value) => value.trim() !== "" || "This field cannot be empty"
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{fieldLabel}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={placeholder}
                  autoFocus
                  autoCapitalize={autoCapitalize}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </SimpleFormDialog>
  )
} 