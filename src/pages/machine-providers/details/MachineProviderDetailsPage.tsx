import { BaseResourceDetailsPage } from "@/pages/base/BaseResourceDetailsPage.tsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx"
import { useParams } from "react-router"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { GeneralInfoCard } from "./GeneralInfoCard.tsx"
import { AwsDetailsCard, AwsSubnetsCard } from "./AwsDetailsCard.tsx"
import { HetznerDetailsCard } from "./HetznerDetailsCard.tsx"
import { SshConfigCard } from "./SshConfigCard.tsx"
import type { components } from "@/api/models/schema";

export function MachineProviderDetailsPage() {
  const { workspaceId } = useSelectedWorkspaceId()
  const { machineProviderId } = useParams<{ machineProviderId: string }>()

  if (!machineProviderId) {
    return <div>Invalid machine provider ID</div>
  }

  return (
    <BaseResourceDetailsPage<components["schemas"]["MachineProvider"], components["schemas"]["UpdateMachineProvider"]>
      title={data => {
        if (!data) {
          return "Machine Provider"
        }
        return `Machine Provider ${data.name}`
      }}
      resourcePath="/v1/workspaces/{workspaceId}/machine-providers/{id}"
      enableDelete={true}
      afterDeleteUrl={`/workspaces/${workspaceId}/machine-providers`}
      apiParams={{
        path: {
          workspaceId: workspaceId,
          id: machineProviderId,
        }
      }}
    >
      {(data, save) => (
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">General Information</TabsTrigger>
            <TabsTrigger value="provider">
              {data.type === 'aws' ? 'AWS Configuration' : 
               data.type === 'hetzner' ? 'Hetzner Configuration' : 
               'Provider Configuration'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <div className="space-y-6">
              <GeneralInfoCard data={data} />
              <SshConfigCard data={data} save={save} />
            </div>
          </TabsContent>

          <TabsContent value="provider">
            {data.aws && (
              <div className="space-y-6">
                <AwsDetailsCard awsData={data.aws} save={save} />
                <AwsSubnetsCard subnets={data.aws.subnets} />
              </div>
            )}

            {data.hetzner && (
              <HetznerDetailsCard hetznerData={data.hetzner} save={save} />
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