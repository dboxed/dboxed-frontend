import { SimpleFormDialog } from "@/components/SimpleFormDialog"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

interface SimpleInputFormData {
  value: string
}

interface SimpleInputDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  fieldLabel: string
  placeholder?: string
  defaultValue?: string
  onSave: (value: string) => (Promise<boolean> | boolean)
}

export function SimpleInputDialog({
  open,
  onOpenChange,
  title,
  fieldLabel,
  placeholder,
  defaultValue = "",
  onSave
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
      open={open}
      onOpenChange={onOpenChange}
      title={title}
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