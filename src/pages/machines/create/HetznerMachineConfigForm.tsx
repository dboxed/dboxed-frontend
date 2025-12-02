import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Server } from "lucide-react"
import type { UseFormReturn } from "react-hook-form"
import { useDboxedQueryClient } from "@/api/client.ts"
import type { components } from "@/api/models/dboxed-schema"

interface HetznerMachineConfigFormProps {
  form: UseFormReturn<any>
}

export function HetznerMachineConfigForm({ form }: HetznerMachineConfigFormProps) {
  const client = useDboxedQueryClient()
  
  // Fetch Hetzner locations
  const locationsQuery = client.useQuery('get', '/v1/machine-provider-info/hetzner/locations')
  
  // Fetch Hetzner server types
  const serverTypesQuery = client.useQuery('get', '/v1/machine-provider-info/hetzner/server-types')

  const locations = locationsQuery.data?.items || []
  const serverTypes = serverTypesQuery.data?.items || []

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Server className="h-5 w-5" />
          <span>Hetzner Machine Configuration</span>
        </CardTitle>
        <CardDescription>
          Configure your Hetzner Cloud server settings.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="hetzner.serverLocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Server Location</FormLabel>
              <FormControl>
                {locations.length > 0 ? (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location: components["schemas"]["HetznerLocation"]) => (
                        <SelectItem key={location.name} value={location.name}>
                          <div className="flex flex-col">
                            <span>{location.description}</span>
                            <span className="text-xs text-muted-foreground">
                              {location.city}, {location.country}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    {locationsQuery.isLoading ? "Loading locations..." : "No locations available"}
                  </div>
                )}
              </FormControl>
              <FormDescription>
                Choose the datacenter location for your server.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hetzner.serverType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Server Type</FormLabel>
              <FormControl>
                {serverTypes.length > 0 ? (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a server type" />
                    </SelectTrigger>
                    <SelectContent>
                      {serverTypes.map((serverType: components["schemas"]["ServerType"]) => (
                        <SelectItem key={serverType.Name} value={serverType.Name}>
                          <div className="flex flex-col">
                            <span className="font-medium">{serverType.Name}</span>
                            <span className="text-xs text-muted-foreground">
                              {serverType.Cores} vCPU, {serverType.Memory} GB RAM, {serverType.Disk} GB {serverType.StorageType}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    {serverTypesQuery.isLoading ? "Loading server types..." : "No server types available"}
                  </div>
                )}
              </FormControl>
              <FormDescription>
                Select the server type that meets your performance requirements.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
} 