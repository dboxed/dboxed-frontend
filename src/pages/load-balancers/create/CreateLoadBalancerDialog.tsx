import { BaseCreateDialog } from "@/components/BaseCreateDialog.tsx"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { useDboxedQueryClient } from "@/api/client.ts"
import type { components } from "@/api/models/dboxed-schema"

interface CreateLoadBalancerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateLoadBalancerDialog({ open, onOpenChange }: CreateLoadBalancerDialogProps) {
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useDboxedQueryClient()

  // Fetch available networks
  const networksQuery = client.useQuery('get', '/v1/workspaces/{workspaceId}/networks', {
    params: {
      path: {
        workspaceId: workspaceId!
      }
    }
  }, {
    enabled: open,
  })

  const networks = networksQuery.data?.items || []

  return (
    <BaseCreateDialog<components["schemas"]["CreateLoadBalancer"]>
      open={open}
      onOpenChange={onOpenChange}
      title="Create Load Balancer"
      apiRoute="/v1/workspaces/{workspaceId}/load-balancers"
      apiParams={{
        path: {
          workspaceId: workspaceId,
        }
      }}
      defaultValues={{
        name: "",
        loadBalancerType: "caddy",
        network: "",
        httpPort: 80,
        httpsPort: 443,
        replicas: 1,
      }}
    >
      {(form) => (
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="my-load-balancer" autoCapitalize="off" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="loadBalancerType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Load Balancer Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a load balancer type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="caddy">Caddy</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="network"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Network</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a network" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {networks.map((network) => (
                      <SelectItem key={network.id} value={network.id}>
                        {network.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="httpPort"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>HTTP Port</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max="65535"
                      placeholder="80"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="httpsPort"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>HTTPS Port</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max="65535"
                      placeholder="443"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="replicas"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Replicas</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    max="100"
                    placeholder="1"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
    </BaseCreateDialog>
  )
}
