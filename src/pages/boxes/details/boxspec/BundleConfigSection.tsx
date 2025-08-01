import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card.tsx"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import { type UseFormReturn } from "react-hook-form"
import type { components } from "@/api/models/schema"
import { DeleteButton } from "@/components/DeleteButton.tsx"

interface BundleConfigSectionProps {
  form: UseFormReturn<components["schemas"]["UpdateBox"]>
  bundleIndex: number
  onDeleteBundle: () => void
}

export function BundleConfigSection({ form, bundleIndex, onDeleteBundle }: BundleConfigSectionProps) {
  const bundleName = form.watch(`boxSpec.fileBundles.${bundleIndex}.name`) || "Unnamed Bundle"

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Bundle Configuration</CardTitle>
          <DeleteButton
            onDelete={onDeleteBundle}
            confirmationTitle="Delete Bundle"
            confirmationDescription={`Are you sure you want to delete "${bundleName}"? This action cannot be undone and will remove all files in this bundle.`}
            size="sm"
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
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