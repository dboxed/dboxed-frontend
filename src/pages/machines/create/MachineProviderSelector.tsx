import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx"
import { Cloud, Server } from "lucide-react"
import type { UseFormReturn } from "react-hook-form"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { useDboxedQueryClient } from "@/api/api"
import type { components } from "@/api/models/schema"

interface MachineProviderSelectorProps {
  form: UseFormReturn<components["schemas"]["CreateMachine"]>
}

export function MachineProviderSelector({ form }: MachineProviderSelectorProps) {
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useDboxedQueryClient()

  const machineProvidersQuery = client.useQuery('get', '/v1/workspaces/{workspaceId}/machine-providers', {
    params: {
      path: {
        workspaceId: workspaceId!,
      }
    }
  })

  const machineProviders = machineProvidersQuery.data?.items || []

  const handleMachineProviderChange = (machineProviderId: string) => {
    const selectedProvider = machineProviders.find((mp: components["schemas"]["MachineProvider"]) =>
      mp.id.toString() === machineProviderId
    )
    
    if (selectedProvider) {
      form.setValue('machineProvider', selectedProvider.id)
    }
  }

  if (machineProvidersQuery.isLoading) {
    return (
      <FormItem>
        <FormLabel>Machine Provider</FormLabel>
        <div className="text-sm text-muted-foreground">Loading machine providers...</div>
      </FormItem>
    )
  }

  if (machineProviders.length === 0) {
    return (
      <FormItem>
        <FormLabel>Machine Provider</FormLabel>
        <div className="text-sm text-muted-foreground">
          No machine providers found. Please create a machine provider first.
        </div>
      </FormItem>
    )
  }

  return (
    <FormField
      control={form.control}
      name="machineProvider"
      rules={{ required: "Machine provider is required" }}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Machine Provider</FormLabel>
          <FormControl>
            <Select onValueChange={handleMachineProviderChange} defaultValue={field.value?.toString()}>
              <SelectTrigger>
                <SelectValue placeholder="Select a machine provider" />
              </SelectTrigger>
              <SelectContent>
                {machineProviders.map((provider: components["schemas"]["MachineProvider"]) => (
                  <SelectItem key={provider.id} value={provider.id.toString()}>
                    <div className="flex items-center space-x-2">
                      {provider.type === "aws" ? (
                        <Cloud className="h-4 w-4" />
                      ) : (
                        <Server className="h-4 w-4" />
                      )}
                      <span>{provider.name} ({provider.type})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
} 