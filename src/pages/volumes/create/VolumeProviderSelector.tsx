import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx";
import { useDboxedQueryClient } from "@/api/api.ts";
import type { UseFormReturn } from "react-hook-form"

interface VolumeProviderSelectorProps {
  form: UseFormReturn<any>
}

export function VolumeProviderSelector({ form }: VolumeProviderSelectorProps) {
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useDboxedQueryClient()

  const volumeProvidersQuery = client.useQuery('get', '/v1/workspaces/{workspaceId}/volume-providers', {
    params: {
      path: {
        workspaceId: workspaceId!,
      }
    }
  })

  return (
    <FormField
      control={form.control}
      name="volume_provider"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Volume Provider</FormLabel>
          <Select
            value={field.value ? field.value.toString() : ""}
            onValueChange={(value) => field.onChange(value)}
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
              {volumeProvidersQuery.data?.items?.length === 0 && (
                <SelectItem value="" disabled>
                  No volume providers available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}