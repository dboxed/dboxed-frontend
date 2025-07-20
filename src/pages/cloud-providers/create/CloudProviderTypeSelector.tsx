import { type UseFormReturn } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx"
import { Cloud, Server } from "lucide-react"

interface CloudProviderTypeSelectorProps {
  form: UseFormReturn<any>
}

export function CloudProviderTypeSelector({ form }: CloudProviderTypeSelectorProps) {
  return (
    <FormField
      control={form.control}
      name="type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Cloud Provider Type</FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select a cloud provider type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aws">
                  <div className="flex items-center space-x-2">
                    <Cloud className="h-4 w-4" />
                    <span>AWS</span>
                  </div>
                </SelectItem>
                <SelectItem value="hetzner">
                  <div className="flex items-center space-x-2">
                    <Server className="h-4 w-4" />
                    <span>Hetzner</span>
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