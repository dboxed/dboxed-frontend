import { BaseResourceDetailsPage } from "@/pages/base/BaseResourceDetailsPage.tsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx"
import { useParams } from "react-router"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { GeneralInfoCard } from "./GeneralInfoCard.tsx"
import { RusticVolumeInfo } from "./RusticVolumeInfo.tsx"
import type { components } from "@/api/models/schema";

export function VolumeDetailsPage() {
  const { workspaceId } = useSelectedWorkspaceId()
  const { volumeId } = useParams<{ volumeId: string }>()

  if (!volumeId) {
    return <div>Invalid volume ID</div>
  }

  const buildUpdateDefaults = (_data: components["schemas"]["Volume"]) => {
    return {}
  }

  return (
    <BaseResourceDetailsPage<components["schemas"]["Volume"], any>
      title="Volume"
      resourcePath="/v1/workspaces/{workspaceId}/volumes/{id}"
      enableDelete={true}
      enableSave={false} // No UpdateVolume schema available
      buildUpdateDefaults={buildUpdateDefaults}
      afterDeleteUrl={`/workspaces/${workspaceId}/volumes`}
      apiParams={{
        path: {
          workspaceId: workspaceId,
          id: volumeId,
        }
      }}
    >
      {(data, _form) => (
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">General Information</TabsTrigger>
            <TabsTrigger value="usage">Volume Usage</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <div className="space-y-6">
              <GeneralInfoCard data={data} />
              {data.volume_provider_type === "rustic" && data.rustic && (
                <RusticVolumeInfo data={data} />
              )}
            </div>
          </TabsContent>

          <TabsContent value="usage">
            <Card>
              <CardHeader>
                <CardTitle>Volume Usage</CardTitle>
                <CardDescription>
                  Information about how this volume is being used.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Volume usage and attachment information will be displayed here when available.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </BaseResourceDetailsPage>
  )
}