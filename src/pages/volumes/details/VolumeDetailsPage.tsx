import { BaseResourceDetailsPage } from "@/pages/base/BaseResourceDetailsPage.tsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx"
import { useParams } from "react-router"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { GeneralInfoCard } from "./GeneralInfoCard.tsx"
import { RusticVolumeInfo } from "./RusticVolumeInfo.tsx"
import { SnapshotsTab } from "./SnapshotsTab.tsx"
import type { components } from "@/api/models/schema";

export function VolumeDetailsPage() {
  const { workspaceId } = useSelectedWorkspaceId()
  const { volumeId } = useParams<{ volumeId: string }>()

  if (!volumeId) {
    return <div>Invalid volume ID</div>
  }

  return (
    <BaseResourceDetailsPage<components["schemas"]["Volume"], any>
      title="Volume"
      resourcePath="/v1/workspaces/{workspaceId}/volumes/{id}"
      enableDelete={true}
      afterDeleteUrl={`/workspaces/${workspaceId}/volumes`}
      apiParams={{
        path: {
          workspaceId: workspaceId,
          id: volumeId,
        }
      }}
    >
      {(data) => (
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">General Information</TabsTrigger>
            <TabsTrigger value="snapshots">Snapshots</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <div className="space-y-6">
              <GeneralInfoCard data={data} />
              {data.volumeProviderType === "rustic" && data.rustic && (
                <RusticVolumeInfo data={data} />
              )}
            </div>
          </TabsContent>

          <TabsContent value="snapshots">
            <SnapshotsTab volumeId={volumeId} />
          </TabsContent>
        </Tabs>
      )}
    </BaseResourceDetailsPage>
  )
}