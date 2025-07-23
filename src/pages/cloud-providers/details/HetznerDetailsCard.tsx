import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import type { UseFormReturn } from "react-hook-form"
import type { components } from "@/api/models/schema"

interface HetznerDetailsCardProps {
  hetznerData: components["schemas"]["CloudProviderHetzner"]
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
          Hetzner Cloud provider configuration details.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Read-only fields */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Hetzner Network ID</label>
              <p className="text-sm text-muted-foreground">{hetznerData.hetzner_network_id || "N/A"}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium">Network Name</label>
              <p className="text-sm text-muted-foreground">{hetznerData.hetzner_network_name}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium">Network Zone</label>
              <p className="text-sm text-muted-foreground">{hetznerData.hetzner_network_zone || "N/A"}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium">Hetzner Network CIDR</label>
              <p className="text-sm text-muted-foreground">{hetznerData.hetzner_network_cidr || "N/A"}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium">Cloud Subnet CIDR</label>
              <p className="text-sm text-muted-foreground">{hetznerData.cloud_subnet_cidr || "N/A"}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium">Robot Subnet CIDR</label>
              <p className="text-sm text-muted-foreground">{hetznerData.robot_subnet_cidr || "N/A"}</p>
            </div>
          </div>
          
          {/* Move editable Robot VSwitch ID here */}
          <FormField
            control={form.control}
            name="hetzner.robot_vswitch_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Robot VSwitch ID</FormLabel>
                <FormControl>
                  <Input
                    placeholder="12345"
                    type="number"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                  />
                </FormControl>
                <FormDescription>
                  Optional robot vSwitch ID for network configuration.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4 pt-4 border-t">
          <FormField
            control={form.control}
            name="hetzner.cloud_token"
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
              name="hetzner.robot_username"
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
              name="hetzner.robot_password"
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