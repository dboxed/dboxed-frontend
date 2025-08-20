import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import { type UseFormReturn } from "react-hook-form"
import type { components } from "@/api/models/schema"

interface VolumeConfigSectionProps {
  form: UseFormReturn<components["schemas"]["UpdateBox"]>
  volumeIndex: number
}

export function VolumeConfigSection({ form, volumeIndex }: VolumeConfigSectionProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Volume Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          key={`boxSpec.volumes.${volumeIndex}.name`}
          name={`boxSpec.volumes.${volumeIndex}.name`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Volume name"
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
          key={`boxSpec.volumes.${volumeIndex}.rootUid`}
          name={`boxSpec.volumes.${volumeIndex}.rootUid`}
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
          key={`boxSpec.volumes.${volumeIndex}.rootGid`}
          name={`boxSpec.volumes.${volumeIndex}.rootGid`}
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
          key={`boxSpec.volumes.${volumeIndex}.rootMode`}
          name={`boxSpec.volumes.${volumeIndex}.rootMode`}
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