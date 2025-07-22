import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx"
import { Cloud, Server } from "lucide-react"
import type { UseFormReturn } from "react-hook-form"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { useUnboxedQueryClient } from "@/api/api"
import type { components } from "@/api/models/schema"

interface CloudProviderSelectorProps {
  form: UseFormReturn<components["schemas"]["CreateMachine"]>
}

export function CloudProviderSelector({ form }: CloudProviderSelectorProps) {
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useUnboxedQueryClient()

  const cloudProvidersQuery = client.useQuery('get', '/v1/workspaces/{workspaceId}/cloud-providers', {
    params: {
      path: {
        workspaceId: workspaceId!,
      }
    }
  })

  const cloudProviders = cloudProvidersQuery.data?.items || []

  const handleCloudProviderChange = (cloudProviderId: string) => {
    const selectedProvider = cloudProviders.find((cp: components["schemas"]["CloudProvider"]) => 
      cp.id.toString() === cloudProviderId
    )
    
    if (selectedProvider) {
      form.setValue('cloud_provider', selectedProvider.id)
    }
  }

  if (cloudProvidersQuery.isLoading) {
    return (
      <FormItem>
        <FormLabel>Cloud Provider</FormLabel>
        <div className="text-sm text-muted-foreground">Loading cloud providers...</div>
      </FormItem>
    )
  }

  if (cloudProviders.length === 0) {
    return (
      <FormItem>
        <FormLabel>Cloud Provider</FormLabel>
        <div className="text-sm text-muted-foreground">
          No cloud providers found. Please create a cloud provider first.
        </div>
      </FormItem>
    )
  }

  return (
    <FormField
      control={form.control}
      name="cloud_provider"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Cloud Provider</FormLabel>
          <FormControl>
            <Select onValueChange={handleCloudProviderChange} defaultValue={field.value?.toString()}>
              <SelectTrigger>
                <SelectValue placeholder="Select a cloud provider" />
              </SelectTrigger>
              <SelectContent>
                {cloudProviders.map((provider: components["schemas"]["CloudProvider"]) => (
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