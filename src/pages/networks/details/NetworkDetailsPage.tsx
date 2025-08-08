import { BaseResourceDetailsPage } from "@/pages/base/BaseResourceDetailsPage.tsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { useParams } from "react-router"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { GeneralInfoCard } from "./GeneralInfoCard.tsx"
import { NetbirdDetailsCard } from "./NetbirdDetailsCard.tsx"
import type { components } from "@/api/models/schema";

export function NetworkDetailsPage() {
  const { workspaceId } = useSelectedWorkspaceId()
  const { networkId } = useParams<{ networkId: string }>()

  if (!networkId) {
    return <div>Invalid network ID</div>
  }

  const buildUpdateDefaults = (data: components["schemas"]["Network"]): components["schemas"]["UpdateNetwork"] => {
    const defaults: components["schemas"]["UpdateNetwork"] = {}

    // Add Netbird-specific defaults if Netbird data exists
    if (data.netbird) {
      defaults.netbird = {
        netbirdVersion: data.netbird.netbirdVersion,
        apiAccessToken: undefined, // Don't pre-populate sensitive token field
      }
    }

    return defaults
  }

  return (
    <BaseResourceDetailsPage<components["schemas"]["Network"], components["schemas"]["UpdateNetwork"]>
      title={data => {
        if (!data) {
          return "Network"
        }
        return `Network ${data.name}`
      }}
      resourcePath="/v1/workspaces/{workspaceId}/networks/{id}"
      enableDelete={true}
      enableSave={true}
      buildUpdateDefaults={buildUpdateDefaults}
      afterDeleteUrl={`/workspaces/${workspaceId}/networks`}
      apiParams={{
        path: {
          workspaceId: workspaceId,
          id: networkId,
        }
      }}
    >
      {(data, form) => (
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">General Information</TabsTrigger>
            <TabsTrigger value="configuration">
              {data.type === 'netbird' ? 'Netbird Configuration' : 'Network Configuration'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <GeneralInfoCard data={data} />
          </TabsContent>

          <TabsContent value="configuration">
            {data.netbird && (
              <NetbirdDetailsCard netbirdData={data.netbird} form={form} />
            )}
            
            {!data.netbird && (
              <Card>
                <CardHeader>
                  <CardTitle>Network Configuration</CardTitle>
                  <CardDescription>
                    No network-specific configuration available.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    This network does not have network-specific configuration.
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