import { BaseResourceDetailsPage } from "@/pages/base/BaseResourceDetailsPage.tsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx"
import { useParams } from "react-router"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { GeneralInfoCard } from "./GeneralInfoCard.tsx"
import { ResticDetailsCard } from "./ResticDetailsCard.tsx"
import type { components } from "@/api/models/dboxed-schema";

export function VolumeProviderDetailsPage() {
  const { workspaceId } = useSelectedWorkspaceId()
  const { volumeProviderId } = useParams<{ volumeProviderId: string }>()

  if (!volumeProviderId) {
    return <div>Invalid volume provider ID</div>
  }

  return (
    <BaseResourceDetailsPage<components["schemas"]["VolumeProvider"], components["schemas"]["UpdateVolumeProvider"]>
      title="Volume Provider"
      resourcePath="/v1/workspaces/{workspaceId}/volume-providers/{id}"
      enableDelete={true}
      afterDeleteUrl={`/workspaces/${workspaceId}/volume-providers`}
      apiParams={{
        path: {
          workspaceId: workspaceId,
          id: volumeProviderId,
        }
      }}
    >
      {(data, save) => (
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">General Information</TabsTrigger>
            <TabsTrigger value="configuration">
              {data.restic ? 'Restic Configuration' : 'Provider Configuration'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <GeneralInfoCard data={data} />
          </TabsContent>

          <TabsContent value="configuration">
            {data.restic ? (
              <div className="space-y-6">
                <ResticDetailsCard volumeProvider={data} save={save} />
              </div>
            ) : (
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