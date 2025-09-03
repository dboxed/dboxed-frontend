import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import type { UseFormReturn } from "react-hook-form"

interface DboxedConfigProps {
  form: UseFormReturn<any>
}

export function DboxedConfig({ form }: DboxedConfigProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>DBoxed Volume Configuration</CardTitle>
        <CardDescription>
          Configure the filesystem settings for the selected DBoxed provider.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="dboxed.fs_size"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Filesystem Size</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter filesystem size (e.g., '10GB', '1TB')" 
                  {...field} 
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dboxed.fs_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Filesystem Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select filesystem type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ext4">ext4</SelectItem>
                  <SelectItem value="xfs">xfs</SelectItem>
                  <SelectItem value="btrfs">btrfs</SelectItem>
                  <SelectItem value="zfs">zfs</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
}