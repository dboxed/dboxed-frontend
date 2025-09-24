import { SimpleFormDialog } from "@/components/SimpleFormDialog"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SimpleSelectFormData {
  value: string
}

interface SimpleSelectDialogProps<T> {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  fieldLabel: string
  placeholder?: string
  options: T[]
  optionKey: keyof T
  optionLabel: keyof T
  onOk: (selectedItem: T) => void
}

export function SimpleSelectDialog<T>({
  open,
  onOpenChange,
  title,
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
      onOk(selectedItem)
      onOpenChange(false)
    }
  }

  return (
    <SimpleFormDialog<SimpleSelectFormData>
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