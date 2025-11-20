import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import { SimpleFormDialog } from "@/components/SimpleFormDialog.tsx"
import type { components } from "@/api/models/dboxed-schema"
import { LabelAndValue } from "@/components/LabelAndValue.tsx";
import { DetailsCardLayout } from "@/components/DetailsCardLayout.tsx";
import { OpenDialogButton } from "@/components/OpenDialogButton.tsx";


interface HetznerEditCredentialsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  save: (update: components["schemas"]["UpdateMachineProvider"]) => Promise<boolean>
}

function HetznerEditCredentialsDialog({ open, onOpenChange, save }: HetznerEditCredentialsDialogProps) {
  const buildInitial = (): components["schemas"]["UpdateMachineProviderHetzner"] => ({
    cloudToken: undefined,
    robotUsername: undefined,
    robotPassword: undefined,
  })

  const handleSave = async (formData: components["schemas"]["UpdateMachineProviderHetzner"]) => {
    return await save({
      hetzner: {
        cloudToken: formData.cloudToken,
        robotUsername: formData.robotUsername,
        robotPassword: formData.robotPassword
      }
    })
  }

  return <SimpleFormDialog<components["schemas"]["UpdateMachineProviderHetzner"]>
    open={open}
    onOpenChange={onOpenChange}
    title="Edit Hetzner Credentials"
    buildInitial={buildInitial}
    onSave={handleSave}
  >
    {(form) => (
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="cloudToken"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hetzner Cloud Token</FormLabel>
              <FormControl>
                <Input
                  placeholder="your-hetzner-cloud-token"
                  type="password"
                  {...field}
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
            name="robotUsername"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Robot Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="robot-username"
                    {...field}
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
            name="robotPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Robot Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="robot-password"
                    type="password"
                    {...field}
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
    )}
  </SimpleFormDialog>
}

interface HetznerNetworkCardProps {
  hetznerData: components["schemas"]["MachineProviderHetzner"]
}

interface HetznerCredentialsCardProps {
  save: (data: components["schemas"]["UpdateMachineProvider"]) => Promise<boolean>
}

export function HetznerNetworkCard({ hetznerData }: HetznerNetworkCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hetzner Network Configuration</CardTitle>
        <CardDescription>
          Network and infrastructure details for the Hetzner provider.
        </CardDescription>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  )
}

export function HetznerCredentialsCard({ save }: HetznerCredentialsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle>Hetzner Credentials</CardTitle>
          <CardDescription>
            Authentication credentials for Hetzner Cloud and Robot APIs.
          </CardDescription>
        </div>
        <OpenDialogButton dialog={HetznerEditCredentialsDialog} save={save}>
          Edit Credentials
        </OpenDialogButton>
      </CardHeader>
      <CardContent>
        <DetailsCardLayout>
          <LabelAndValue
            label="Cloud Token"
            textValue={"••••••••••••"}
          />

          <LabelAndValue
            label="Robot Username"
            textValue={"••••••••••••"}
          />

          <LabelAndValue
            label="Robot Password"
            textValue={"••••••••••••"}
          />
        </DetailsCardLayout>
      </CardContent>
    </Card>
  )
}

// Legacy export for backward compatibility - use HetznerNetworkCard and HetznerCredentialsCard instead
export function HetznerDetailsCard({ hetznerData, save }: { hetznerData: components["schemas"]["MachineProviderHetzner"], save: (data: components["schemas"]["UpdateMachineProvider"]) => Promise<boolean> }) {
  return (
    <div className="space-y-6">
      <HetznerNetworkCard hetznerData={hetznerData} />
      <HetznerCredentialsCard save={save} />
    </div>
  )
} 