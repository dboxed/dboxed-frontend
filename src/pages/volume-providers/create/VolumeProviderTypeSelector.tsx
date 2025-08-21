import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx"
import type { UseFormReturn } from "react-hook-form"

interface VolumeProviderTypeSelectorProps {
  form: UseFormReturn<any>
}

export function VolumeProviderTypeSelector({ form }: VolumeProviderTypeSelectorProps) {
  return (
    <FormField
      control={form.control}
      name="type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Volume Provider Type</FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a volume provider type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="restic">Restic</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}