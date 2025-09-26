import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import type { UseFormReturn } from "react-hook-form"
import type { components } from "@/api/models/schema"
import { Label } from "@/components/ui/label.tsx";

interface HetznerDetailsCardProps {
  hetznerData: components["schemas"]["MachineProviderHetzner"]
  form: UseFormReturn<any>
}

export function HetznerDetailsCard({ hetznerData, form }: HetznerDetailsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>Hetzner Configuration</span>
        </CardTitle>
        <CardDescription>
          Hetzner Machine provider configuration details.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Read-only fields */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Hetzner Network ID</Label>
              <p className="text-sm text-muted-foreground">{hetznerData.hetznerNetworkId || "N/A"}</p>
            </div>
            
            <div>
              <Label>Network Name</Label>
              <p className="text-sm text-muted-foreground">{hetznerData.hetznerNetworkName}</p>
            </div>
            
            <div>
              <Label>Network Zone</Label>
              <p className="text-sm text-muted-foreground">{hetznerData.hetznerNetworkZone || "N/A"}</p>
            </div>
            
            <div>
              <Label>Hetzner Network CIDR</Label>
              <p className="text-sm text-muted-foreground">{hetznerData.hetznerNetworkCidr || "N/A"}</p>
            </div>
            
            <div>
              <Label>Cloud Subnet CIDR</Label>
              <p className="text-sm text-muted-foreground">{hetznerData.cloudSubnetCidr || "N/A"}</p>
            </div>
            
            <div>
              <Label>Robot Subnet CIDR</Label>
              <p className="text-sm text-muted-foreground">{hetznerData.robotSubnetCidr || "N/A"}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t">
          <FormField
            control={form.control}
            name="hetzner.cloudToken"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hetzner Cloud Token</FormLabel>
                <FormControl>
                  <Input
                    placeholder="your-hetzner-cloud-token"
                    type="password"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription>
                  Your Hetzner Cloud API token for authentication.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="hetzner.robotUsername"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Robot Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="robot-username"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional robot username for additional authentication.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hetzner.robotPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Robot Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="robot-password"
                      type="password"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional robot password for additional authentication.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 