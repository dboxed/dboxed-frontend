import { type UseFormReturn } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx"
import { Network } from "lucide-react"

interface NetworkTypeSelectorProps {
  form: UseFormReturn<any>
}

export function NetworkTypeSelector({ form }: NetworkTypeSelectorProps) {
  return (
    <FormField
      control={form.control}
      name="type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Network Type</FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select a network type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="netbird">
                  <div className="flex items-center space-x-2">
                    <Network className="h-4 w-4" />
                    <span>Netbird</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
} 