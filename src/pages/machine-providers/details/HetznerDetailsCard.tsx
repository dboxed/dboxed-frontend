import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import type { UseFormReturn } from "react-hook-form"
import type { components } from "@/api/models/schema"
import { LabelAndValue } from "@/components/LabelAndValue.tsx";
import { DetailsCardLayout } from "@/components/DetailsCardLayout.tsx";

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
        <DetailsCardLayout>
            <LabelAndValue
              label="Hetzner Network ID"
              textValue={hetznerData.hetznerNetworkId || "N/A"}
            />
            
            <LabelAndValue
              label="Network Name"
              textValue={hetznerData.hetznerNetworkName}
            />
            
            <LabelAndValue
              label="Network Zone"
              textValue={hetznerData.hetznerNetworkZone || "N/A"}
            />
            
            <LabelAndValue
              label="Hetzner Network CIDR"
              textValue={hetznerData.hetznerNetworkCidr || "N/A"}
            />
            
            <LabelAndValue
              label="Cloud Subnet CIDR"
              textValue={hetznerData.cloudSubnetCidr || "N/A"}
            />
            
            <LabelAndValue
              label="Robot Subnet CIDR"
              textValue={hetznerData.robotSubnetCidr || "N/A"}
            />
        </DetailsCardLayout>

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