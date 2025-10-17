import { BaseResourceDetailsPage } from "@/pages/base/BaseResourceDetailsPage.tsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx"
import { useParams } from "react-router"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { GeneralInfoCard } from "./GeneralInfoCard"
import { BoxConnectCard } from "./BoxConnectCard.tsx"
import { LogsPage } from "./logs/LogsPage.tsx"
import { VolumesTab } from "./volumes/VolumesTab.tsx"
import { ComposeProjects } from "./compose-projects/ComposeProjects.tsx"
import type { components } from "@/api/models/schema"

export function BoxDetailsPage() {
  const { workspaceId } = useSelectedWorkspaceId()
  const { boxId } = useParams<{ boxId: string }>()

  if (!boxId) {
    return <div>Invalid box ID</div>
  }

  return (
    <BaseResourceDetailsPage<components["schemas"]["Box"], components["schemas"]["UpdateBox"]>
      title={data => {
        if (!data) {
          return "Box"
        }
        return `Box ${data.name}`
      }}
      resourcePath="/v1/workspaces/{workspaceId}/boxes/{id}"
      enableDelete={true}
      afterDeleteUrl={`/workspaces/${workspaceId}/boxes`}
      apiParams={{
        path: {
          workspaceId: workspaceId,
          id: boxId,
        }
      }}
    >
      {(data, _save) => (
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general">General Information</TabsTrigger>
            <TabsTrigger value="connect">Connect Box</TabsTrigger>
            <TabsTrigger value="volumes">Volumes</TabsTrigger>
            <TabsTrigger value="compose">Compose Projects</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <GeneralInfoCard data={data} />
          </TabsContent>

          <TabsContent value="connect">
            <BoxConnectCard box={data} />
          </TabsContent>

          <TabsContent value="volumes">
            <VolumesTab box={data} />
          </TabsContent>

          <TabsContent value="compose">
            <ComposeProjects box={data} />
          </TabsContent>

          <TabsContent value="logs">
            <LogsPage box={data} />
          </TabsContent>
        </Tabs>
      )}
    </BaseResourceDetailsPage>
  )
} 