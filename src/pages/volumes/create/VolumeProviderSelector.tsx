import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx";
import { useDboxedQueryClient } from "@/api/api.ts";
import { useEffect } from "react"
import type { UseFormReturn } from "react-hook-form"
import type { components } from "@/api/models/schema"

interface VolumeProviderSelectorProps {
  form: UseFormReturn<components["schemas"]["CreateVolume"]>
  onProviderChange?: (provider: components["schemas"]["VolumeProvider"] | null) => void
}

export function VolumeProviderSelector({ form, onProviderChange }: VolumeProviderSelectorProps) {
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useDboxedQueryClient()

  const volumeProvidersQuery = client.useQuery('get', '/v1/workspaces/{workspaceId}/volume-providers', {
    params: {
      path: {
        workspaceId: workspaceId!,
      }
    }
  })

  // Set first provider as default when data loads and notify parent
  useEffect(() => {
    if (volumeProvidersQuery.data?.items && volumeProvidersQuery.data.items.length > 0) {
      const currentValue = form.getValues('volumeProvider')
      if (!currentValue) { // Only set if no value
        const firstProvider = volumeProvidersQuery.data.items[0]
        form.setValue('volumeProvider', firstProvider.id)
        onProviderChange?.(firstProvider)
      }
    }
  }, [volumeProvidersQuery.data, form, onProviderChange])

  return (
    <FormField
      control={form.control}
      name="volumeProvider"
      render={({ field }) => {
        // Notify parent when selection changes
        const handleProviderChange = (value: string) => {
          field.onChange(value)
          const selectedProvider = volumeProvidersQuery.data?.items?.find(p => p.id.toString() === value)
          onProviderChange?.(selectedProvider || null)
        }

        return (
        <FormItem>
          <FormLabel>Volume Provider</FormLabel>
          <Select
            value={field.value ? field.value.toString() : ""}
            onValueChange={handleProviderChange}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a volume provider" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {volumeProvidersQuery.data?.items?.map((provider) => (
                <SelectItem key={provider.id} value={provider.id.toString()}>
                  {provider.name} ({provider.type})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
        )
      }}
    />
  )
}