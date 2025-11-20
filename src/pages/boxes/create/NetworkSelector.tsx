import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx"
import { Network } from "lucide-react"
import type { UseFormReturn } from "react-hook-form"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { useDboxedQueryClient } from "@/api/dboxed-api.ts"
import type { components } from "@/api/models/dboxed-schema"

interface NetworkSelectorProps {
  form: UseFormReturn<components["schemas"]["CreateBox"]>
}

export function NetworkSelector({ form }: NetworkSelectorProps) {
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useDboxedQueryClient()

  const networksQuery = client.useQuery('get', '/v1/workspaces/{workspaceId}/networks', {
    params: {
      path: {
        workspaceId: workspaceId!,
      }
    }
  })

  const networks = networksQuery.data?.items || []

  const handleNetworkChange = (networkId: string) => {
    const selectedNetwork = networks.find((network: components["schemas"]["Network"]) => 
      network.id.toString() === networkId
    )
    
    if (selectedNetwork) {
      form.setValue('network', selectedNetwork.id)
    }
  }

  if (networksQuery.isLoading) {
    return (
      <FormItem>
        <FormLabel>Network (Optional)</FormLabel>
        <div className="text-sm text-muted-foreground">Loading networks...</div>
      </FormItem>
    )
  }

  if (networks.length === 0) {
    return (
      <FormItem>
        <FormLabel>Network (Optional)</FormLabel>
        <div className="text-sm text-muted-foreground">
          No networks found. You can create a network later if needed.
        </div>
      </FormItem>
    )
  }

  return (
    <FormField
      control={form.control}
      name="network"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Network (Optional)</FormLabel>
          <FormControl>
            <Select onValueChange={handleNetworkChange} defaultValue={field.value?.toString()}>
              <SelectTrigger>
                <SelectValue placeholder="Select a network (optional)" />
              </SelectTrigger>
              <SelectContent>
                {networks.map((network: components["schemas"]["Network"]) => (
                  <SelectItem key={network.id} value={network.id.toString()}>
                    <div className="flex items-center space-x-2">
                      <Network className="h-4 w-4" />
                      <div className="flex flex-col">
                        <span>{network.name}</span>
                        <span className="text-xs text-muted-foreground capitalize">
                          {network.type} • {network.status}
                        </span>
                      </div>
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