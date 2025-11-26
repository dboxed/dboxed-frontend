import { SimpleFormDialog } from "@/components/SimpleFormDialog"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ReactNode } from "react";

interface SimpleSelectFormData {
  value: string
}

interface SimpleSelectDialogProps<T> {
  trigger: ReactNode
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  fieldLabel: string
  placeholder?: string
  options: T[]
  optionKey: keyof T
  optionLabel: keyof T
  onOk: (selectedItem: T) => Promise<boolean>
}

export function SimpleSelectDialog<T>({
  trigger,
  onOpenChange,
  title,
  description,
  fieldLabel,
  placeholder = "Select an option...",
  options,
  optionKey,
  optionLabel,
  onOk
}: SimpleSelectDialogProps<T>) {
  const buildInitial = (): SimpleSelectFormData => ({
    value: "",
  })

  const handleSave = async (data: SimpleSelectFormData) => {
    const selectedItem = options.find(option => String(option[optionKey]) === data.value)
    if (selectedItem) {
      return onOk(selectedItem)
    }
    return false
  }

  return (
    <SimpleFormDialog<SimpleSelectFormData>
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
            required: "Please select an option"
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{fieldLabel}</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder={placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {options.map((option) => (
                      <SelectItem
                        key={String(option[optionKey])}
                        value={String(option[optionKey])}
                      >
                        {String(option[optionLabel])}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </SimpleFormDialog>
  )
}