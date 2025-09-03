import { BaseResourceDetailsPage } from "@/pages/base/BaseResourceDetailsPage.tsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx"
import { useParams } from "react-router"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { GeneralInfoCard } from "./GeneralInfoCard.tsx"
import { DboxedDetailsCard } from "./DboxedDetailsCard.tsx"
import type { components } from "@/api/models/schema";

export function VolumeProviderDetailsPage() {
  const { workspaceId } = useSelectedWorkspaceId()
  const { volumeProviderId } = useParams<{ volumeProviderId: string }>()

  if (!volumeProviderId) {
    return <div>Invalid volume provider ID</div>
  }

  const buildUpdateDefaults = (data: components["schemas"]["VolumeProvider"]): components["schemas"]["UpdateVolumeProvider"] => {
    const defaults: components["schemas"]["UpdateVolumeProvider"] = {}

    // Add DBoxed-specific defaults if DBoxed data exists
    // Note: Sensitive fields (token) are not 
    // returned by the API for security reasons, so we start with empty values
    if (data.dboxed) {
      defaults.dboxed = {
        api_url: undefined,
        repository_id: undefined,
        token: undefined,
      }
    }

    return defaults
  }

  return (
    <BaseResourceDetailsPage<components["schemas"]["VolumeProvider"], components["schemas"]["UpdateVolumeProvider"]>
      title="Volume Provider"
      resourcePath="/v1/workspaces/{workspaceId}/volume-providers/{id}"
      enableDelete={true}
      enableSave={true}
      buildUpdateDefaults={buildUpdateDefaults}
      afterDeleteUrl={`/workspaces/${workspaceId}/volume-providers`}
      apiParams={{
        path: {
          workspaceId: workspaceId,
          id: volumeProviderId,
        }
      }}
    >
      {(data, form) => (
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">General Information</TabsTrigger>
            <TabsTrigger value="configuration">
              {data.type === 'dboxed' ? 'DBoxed Configuration' : 'Provider Configuration'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <GeneralInfoCard data={data} />
          </TabsContent>

          <TabsContent value="configuration">
            {data.dboxed && (
              <DboxedDetailsCard dboxedData={data.dboxed} form={form} />
            )}
            
            {!data.dboxed && (
              <Card>
                <CardHeader>
                  <CardTitle>Provider Configuration</CardTitle>
                  <CardDescription>
                    No provider-specific configuration available.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    This volume provider does not have provider-specific configuration.
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