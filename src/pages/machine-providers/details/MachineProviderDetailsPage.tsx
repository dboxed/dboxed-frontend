import { BaseResourceDetailsPage } from "@/pages/base/BaseResourceDetailsPage.tsx"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs.tsx"
import { useParams } from "react-router"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { GeneralInfoCard } from "./GeneralInfoCard.tsx"
import { AwsDetailsCard, AwsSubnetsCard } from "./AwsDetailsCard.tsx"
import { HetznerDetailsCard } from "./HetznerDetailsCard.tsx"
import type { components } from "@/api/models/schema";

export function MachineProviderDetailsPage() {
  const { workspaceId } = useSelectedWorkspaceId()
  const { machineProviderId } = useParams<{ machineProviderId: string }>()

  if (!machineProviderId) {
    return <div>Invalid machine provider ID</div>
  }

  const buildUpdateDefaults = (data: components["schemas"]["MachineProvider"]): components["schemas"]["UpdateMachineProvider"] => {
    const defaults: components["schemas"]["UpdateMachineProvider"] = {
    }

    // Add Hetzner-specific defaults if Hetzner data exists
    if (data.hetzner) {
      defaults.hetzner = {
        robot_vswitch_id: data.hetzner.robot_vswitch_id || undefined,
      }
    }

    return defaults
  }

  return (
    <BaseResourceDetailsPage<components["schemas"]["MachineProvider"], components["schemas"]["UpdateMachineProvider"]>
      title="Machine Provider"
      resourcePath="/v1/workspaces/{workspaceId}/machine-providers/{id}"
      enableDelete={true}
      enableSave={true}
      buildUpdateDefaults={buildUpdateDefaults}
      afterDeleteUrl={`/workspaces/${workspaceId}/machine-providers`}
      apiParams={{
        path: {
          workspaceId: workspaceId,
          id: machineProviderId,
        }
      }}
    >
      {(data, form) => (
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General Information</TabsTrigger>
            <TabsTrigger value="ssh">SSH Configuration</TabsTrigger>
            <TabsTrigger value="provider">
              {data.type === 'aws' ? 'AWS Configuration' : 
               data.type === 'hetzner' ? 'Hetzner Configuration' : 
               'Provider Configuration'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <GeneralInfoCard data={data} />
          </TabsContent>

          <TabsContent value="ssh">
            <Card>
              <CardHeader>
                <CardTitle>SSH Configuration</CardTitle>
                <CardDescription>
                  SSH key configuration for the machine provider.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="ssh_key_public"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SSH Public Key</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter SSH public key" 
                          {...field} 
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="provider">
            {data.aws && (
              <div className="space-y-6">
                <AwsDetailsCard awsData={data.aws} form={form} />
                <AwsSubnetsCard subnets={data.aws.subnets} />
              </div>
            )}
            
            {data.hetzner && (
              <HetznerDetailsCard hetznerData={data.hetzner} form={form} />
            )}
            
            {!data.aws && !data.hetzner && (
              <Card>
                <CardHeader>
                  <CardTitle>Provider Configuration</CardTitle>
                  <CardDescription>
                    No provider-specific configuration available.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    This machine provider does not have provider-specific configuration.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}
    </BaseResourceDetailsPage>
  )
} 