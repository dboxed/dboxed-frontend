import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card.tsx"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import { type UseFormReturn } from "react-hook-form"
import type { components } from "@/api/models/schema"

interface BundleConfigSectionProps {
  form: UseFormReturn<components["schemas"]["UpdateBox"]>
  bundleIndex: number
}

export function BundleConfigSection({ form, bundleIndex }: BundleConfigSectionProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Bundle Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          key={`boxSpec.fileBundles.${bundleIndex}.name`}
          name={`boxSpec.fileBundles.${bundleIndex}.name`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Bundle name"
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
          key={`boxSpec.fileBundles.${bundleIndex}.rootUid`}
          name={`boxSpec.fileBundles.${bundleIndex}.rootUid`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Root UID</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0"
                  {...field}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          key={`boxSpec.fileBundles.${bundleIndex}.rootGid`}
          name={`boxSpec.fileBundles.${bundleIndex}.rootGid`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Root GID</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0"
                  {...field}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          key={`boxSpec.fileBundles.${bundleIndex}.rootMode`}
          name={`boxSpec.fileBundles.${bundleIndex}.rootMode`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Root Mode</FormLabel>
              <FormControl>
                <Input
                  placeholder="0755"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
}